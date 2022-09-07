import { defineStore } from "pinia";
import { fetchFileContent } from "@/utils/github";

interface CodeFile {
  isLoading?: boolean,
  localContent?: string,
  remoteContent?: string | null,
}

interface FilesMap { 
  [key: string]: CodeFile | undefined 
}

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
      this.updateFile(filepath, { isLoading: true })
      const content = await fetchFileContent(filepath);

      const newState: CodeFile = {
        isLoading: false,
        remoteContent: content,
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

    updateFileContent(filepath: string, localContent: string) {
      this.updateFile(filepath, { localContent });
    }
  }
})