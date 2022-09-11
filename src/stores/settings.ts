import { format } from '@/utils/template';
import { defineStore } from "pinia";

const STORAGE_KEY = 'nog:settings';

interface Settings {
  token: string,
  repoUser: string,
  repoName: string,
  newNoteFilepath: string,
  newNoteTemplate: string,
  separator: string,
}

const DEFAULT_NEW_NOTE_FILEPATH = 'notes/{YYYY}-{MM}-{DD}.md';
const DEFAULT_NEW_NOTE_TEMPLATE = `## {hh}:{mm}:{ss}

{value}
`;
const DEFAULT_SEPARATOR = `

-----
`;

export const useSettings = defineStore('settings', {
  state: () => ({
    token: '',
    repoUser: '',
    repoName: '',
    newNoteFilepath: DEFAULT_NEW_NOTE_FILEPATH,
    newNoteTemplate: DEFAULT_NEW_NOTE_TEMPLATE,
    separator: DEFAULT_SEPARATOR,
  }),
  
  getters: {
    repo: (state) => state.repoUser && state.repoName
      ? `${state.repoUser}/${state.repoName}`
      : '',
    formattedNewNoteFilepath: (state) => format(state.newNoteFilepath),
    formattedNewNoteTemplate: (state) => format(state.newNoteTemplate),
    formattedSeparator: (state) => format(state.separator),
  },

  actions: {
    save({ token, repoUser, repoName, newNoteFilepath, newNoteTemplate, separator }: Settings) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        token, 
        repoUser, 
        repoName,
        newNoteFilepath,
        newNoteTemplate,
        separator,
      }));

      this.token = token;
      this.repoUser = repoUser;
      this.repoName = repoName;
      this.newNoteFilepath = newNoteFilepath;
      this.newNoteTemplate = newNoteTemplate;
      this.separator = separator;
    },

    load() {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        return;
      }

      try {
        const settings = JSON.parse(json);
        this.token = settings.token;
        this.repoUser = settings.repoUser;
        this.repoName = settings.repoName;
        this.newNoteFilepath = settings.newNoteFilepath ?? DEFAULT_NEW_NOTE_FILEPATH;
        this.newNoteTemplate = settings.newNoteTemplate ?? DEFAULT_NEW_NOTE_TEMPLATE;
        this.separator = settings.separator ?? DEFAULT_SEPARATOR;
      } catch (err) {
        console.error(err);
      }
    },
  },
});