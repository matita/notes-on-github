import { defineStore } from "pinia";
import { fetchFileContent } from "@/utils/github";

interface FilesMap { 
  [key: string]: string 
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
      const content = await fetchFileContent(filepath);
      this.$state.files[filepath] = content;
    },

    updateFile(filepath: string, fileContent: string) {
      this.$state.files[filepath] = fileContent;
    },
  }
})