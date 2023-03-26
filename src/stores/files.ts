import { defineStore, type StoreDefinition } from "pinia";
import { fetchContent, fetchFile, updateFileContent } from "@/utils/github";
import type { UpdateFileOptions } from '@/utils/github'
import { debounce } from "lodash";

const DEBOUNCE_UPDATE_MS = 1000;
const CONFIRM_MERGE_ERROR = `Error while saving, most likely the file has changed remotely.
Do you want to refresh the page to synchronize?
!!! Please note that you might lose your changes !!!`;

interface CodeFile {
  isPulling?: boolean,
  isPushing?: boolean,
  localContent?: string,
  remoteContent?: string | null,
  sha?: string,
  type?: 'dir' | 'file',
}

interface FilesMap { 
  [key: string]: CodeFile | undefined 
}

const count = (text:string, token:string) => text.split(token).length - 1;

const preventClose = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  return event.returnValue = 'You might lose your changes, do you want to really close the window?';
};

const debouncedUpdates = {};
const debouncedUpdateFile = (filepath: string) => {
  const fn = debouncedUpdates[filepath] || debounce(async (store: StoreDefinition, filepath: string, payload:UpdateFileOptions) => {
    console.log('after debounce', { filepath, payload });
    store.updateFile(filepath, { isPushing: true });
    const file = store.getFile(filepath);
    const newGhFile = await updateFileContent(filepath, { ...payload, sha: file.sha });

    store.preventWindowClose(false);

    if (newGhFile?.message && newGhFile?.message?.match(/does not match/)) {
      if (confirm(CONFIRM_MERGE_ERROR)) {
        return location.reload();
      }
    }
    
    const newState: CodeFile = { isPushing: false };
    if (newGhFile?.content?.sha) {
      newState.sha = newGhFile.content.sha;
    }

    store.updateFile(filepath, newState);
  }, DEBOUNCE_UPDATE_MS);

  debouncedUpdates[filepath] = fn;
  return fn;
}

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: {} as FilesMap,
    preventingClose: false,
    fetchingfiles: false,
    dirsToFetch: [] as string[],
  }),

  getters: {
    getFile: (state) => (filepath:string) => state.files[filepath],
    getFileContent: (state) => (filepath: string) => { 
      const file = state.files[filepath];
      return file?.localContent;
    },
    listFiles: (state) => Object.entries(state.files)
      .filter(([ filepath, item ]) => item?.type === 'file')
      .sort(([a], [b]) => (
        count(a, '/') - count(b, '/')
        || a.localeCompare(b)
      ))
      .map(([ filepath ]) => filepath),
  },

  actions: {
    async fetchFile(filepath: string) {
      this.updateFile(filepath, { isPulling: true })
      const { content, sha } = (await fetchFile(filepath)) || {};

      const newState: CodeFile = {
        isPulling: false,
        remoteContent: content,
        sha,
      };

      if (!this.getFile(filepath)?.localContent && content) {
        newState.localContent = content;
      }
      this.updateFile(filepath, newState);
    },

    updateFile(filepath: string, options: CodeFile) {
      const currentFile = this.$state.files[filepath] || {};

      if (currentFile.sha && ('sha' in options) && !options.sha) {
        throw new Error('Removing sha');
      }

      this.$patch({
        files: {
          ...this.$state.files,
          [filepath]: {
            ...currentFile,
            ...options,
          },
        },
      });
    },

    updateFileContent(filepath: string, localContent: string) {
      this.preventWindowClose(true);
      this.updateFile(filepath, { localContent, type: 'file' });
      return debouncedUpdateFile(filepath)(this, filepath, { 
        content: localContent,
        message: 'Update file'
      });
    },

    appendContent(filepath: string, toAppend: string, withSeparator = true) {
      const file = this.getFile(filepath);
      const content = file?.localContent;
      const lineBreak = '-----'
      const separator = withSeparator ? `\n\n${lineBreak}\n` : '';
      const newContent = content?.trim()
        ? content.replace(new RegExp(lineBreak + '\\n*$'), '').trim() + separator + toAppend
        : toAppend;

      this.updateFileContent(filepath, newContent);
    },

    preventWindowClose(shouldPrevent: boolean) {
      if (shouldPrevent && !this.preventingClose) {
        window.addEventListener('beforeunload', preventClose, { capture: true });
        this.preventingClose = true;
      }

      if (!shouldPrevent && this.preventingClose) {
        window.removeEventListener('beforeunload', preventClose, { capture: true });
        this.preventingClose = false;
      }
    },

    async fetchAllFiles(path: string = '') {
      try {
        this.fetchingfiles = true;
        const items = await fetchContent(path);
        if (items?.message) {
          return console.error(`Error while fetching files at '${path}': ${items.message}`);
        }
  
        if (!Array.isArray(items)) {
          return console.warn(`Return of fetchAllFiles('${path}') is not an array.`, items);
        }
  
        for (const item of items) {
          const { path, name, sha, type } = item;
          if (name.startsWith('.')) {
            continue;
          }

          const existingFile = this.files[path] || {};
          // Avoid to recurse on dirs that are not changed from last time
          if (type === 'dir' && existingFile.sha !== sha) {
            this.dirsToFetch.push(path);
          }

          this.updateFile(path, { sha, type });
        }

        const dirToFetch = this.dirsToFetch.shift();
        if (dirToFetch) {
          this.fetchAllFiles(dirToFetch);
        }
      } finally {
        this.fetchingfiles = false;
      }
    },
  }
})