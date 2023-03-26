import type { EditorView } from "codemirror";
import { defineStore } from "pinia";

interface Note {
  view: EditorView
  text: string
  from: number
  to: number
}

export const useCurrentTimedNote = defineStore('currentTimedNote', {
  state: () => ({
    currentNote: null as Note | null,
  }),

  actions: {
    setCurrentNote(note: Note | null) {
      this.currentNote = note;
    }
  }
})