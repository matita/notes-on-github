import { defineStore } from "pinia";

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: new Map<string, string>()
  }),

  getters: {
    fileContent: (state) => (filepath:string) => state.files.get(filepath),
  },

  actions: {
    fetchFile(filepath: string):string {
      return this.$state.files.get(filepath) as string;
    },

    updateFile(filepath: string, fileContent: string) {
      this.$state.files.set(filepath, fileContent);
    },
  }
})