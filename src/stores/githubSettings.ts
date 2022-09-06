import { defineStore } from "pinia";

const STORAGE_KEY = 'nog:settings';

export const useGithubSettings = defineStore('githubSettings', {
  state: () => ({
    token: '',
    repoUser: '',
    repoName: '',
  }),

  getters: {
    repo: (state) => state.repoUser && state.repoName
      ? `${state.repoUser}/${state.repoName}`
      : '',
  },

  actions: {
    save({ token, repoUser, repoName }) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, repoUser, repoName }));
      this.token = token;
      this.repoUser = repoUser;
      this.repoName = repoName;
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
      } catch (err) {
        console.error(err);
      }
    },
  }
})