import { format } from '@/utils/template';
import { defineStore } from "pinia";

const newNoteTemplate = `## {hh}:{mm}:{ss}

`;

export const useSettings = defineStore('settings', {
  state: () => ({
    newNoteTemplate,
  }),
  
  getters: {
    formattedNewNoteTemplate: (state) => format(state.newNoteTemplate),
  },
});