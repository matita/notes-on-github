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
    fileContent: (state) => (filepath:string) => state.files[filepath],
  },

  actions: {
    async fetchFile(filepath: string) {
      this.updateFile(filepath, { isLoading: true })
      const content = await fetchFileContent(filepath);
      this.updateFile(filepath, {
        isLoading: false,
        remoteContent: content,
      });
    },

    updateFile(filepath: string, options: CodeFile) {
      const currentFile = this.$state.files[filepath] || {};
      this.$state.files[filepath] = {
        ...currentFile,
        ...options,
      };
    },
  }
})