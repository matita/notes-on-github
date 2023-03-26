import { defineStore } from "pinia";

export const useCurrentFile = defineStore('currentFile', {
  state: () => ({
    value: '',
  }),

  actions: {
    set(filepath: string) {
      this.$state.value = filepath
    }
  }
})