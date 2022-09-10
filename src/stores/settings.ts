import { format } from '@/utils/template';
import { defineStore } from "pinia";

const newNoteTemplate = `## {hh}:{mm}:{ss}

{value}
`;

const separator = `

-----
`;

export const useSettings = defineStore('settings', {
  state: () => ({
    newNoteTemplate,
    separator,
  }),
  
  getters: {
    formattedNewNoteTemplate: (state) => format(state.newNoteTemplate),
    formattedSeparator: (state) => format(state.separator),
  },
});