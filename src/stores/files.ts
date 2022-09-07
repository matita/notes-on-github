import { defineStore } from "pinia";
import { fetchFile, updateFileContent } from "@/utils/github";
import type { UpdateFileOptions } from '@/utils/github'
import { debounce } from "lodash";

const DEBOUNCE_UPDATE_MS = 1000;

interface CodeFile {
  isPulling?: boolean,
  isPushing?: boolean,
  localContent?: string,
  remoteContent?: string | null,
  sha?: string,
}

interface FilesMap { 
  [key: string]: CodeFile | undefined 
}

const debouncedUpdateFile = debounce(async (store, filepath, payload:UpdateFileOptions) => {
  store.updateFile(filepath, { isPushing: true });
  const newGhFile = await updateFileContent(filepath, payload);
  store.updateFile(filepath, { 
    isPushing: false,
    sha: newGhFile?.content?.sha,
  });
}, DEBOUNCE_UPDATE_MS);

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: {} as FilesMap
  }),

  getters: {
    getFile: (state) => (filepath:string) => state.files[filepath],
    getFileContent: (state) => (filepath: string) => state.files[filepath]?.localContent
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
      this.$state.files[filepath] = {
        ...currentFile,
        ...options,
      };
    },

    async updateFileContent(filepath: string, localContent: string) {
      this.updateFile(filepath, { localContent });
      const file = this.getFile(filepath);
      
      debouncedUpdateFile(this, filepath, { 
        content: localContent,
        message: 'Update file',
        sha: file?.sha
      });
    }
  }
})