<script setup lang="ts">
import { useCurrentFile } from '@/stores/currentFile';
import { useCurrentTimedNote } from '@/stores/currentTimedNote';
import { useFilesStore } from '@/stores/files';
import { formatDateAndTime, parseDate } from '@/utils/date';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';

const currentNote = useCurrentTimedNote();
const files = useFilesStore();
const currentFile = useCurrentFile();
const $toast = useToast();

const isMoving = ref(false);
const projects = computed(() => files.listFiles
  .filter((filepath: string) => !/\d{4}-\d{2}-\d{2}\.md$/i.test(filepath)))

const close = () => {
  currentNote.setCurrentNote(null);
  isMoving.value = false;
}

const onMoveClick = () => {
  isMoving.value = true;
}

const onNewFileClick = () => {
  const file = prompt('File path');
  if (!file) {
    return;
  }

  const filepath = /\.\w{2,4}$/.test(file) ? file : `${file}.md`;
  moveToFile(filepath);
}

const onDeleteClick = () => {
  const { currentNote: note } = currentNote;
  if (!note) {
    return;
  }
  const line = note.text.split('\n')[0];
  if (!confirm(`Do you want to delete '${line}'`)) {
    return;
  }

  deleteNote();
  close();
}

const moveToFile = async (filepath: string) => {
  const text = currentNote.currentNote?.text;
  if (!text) {
    return;
  }

  const date = parseDate(text, parseDate(currentFile.value));
  const newDatedText = text.replace(/^[^\n]*/, `## ${formatDateAndTime(date)}`);
  const line = newDatedText.split('\n')[0];

  if (!confirm(`Are you sure you want to move '${line}' to '${filepath}'?`)) {
    return;
  }
  
  await files.fetchFile(filepath)
  files.appendContent(filepath, newDatedText, true);
  deleteNote();
  close();
  $toast.success(`Moved to <a href="#/edit/${filepath}">${filepath}</a>`, { duration: 3000 });
}

const deleteNote = () => {
  const { currentNote: note } = currentNote;
  if (!note) {
    return;
  }

  note.view.dispatch({
    changes: [{
      from: note.from,
      to: note.to,
      insert: '',
    }],
  });
}
</script>

<template>
  <div class="note-menu-wrapper" v-if="currentNote.currentNote" @click="close">
    <div class="note-menu" v-if="!isMoving">
      <button class="note-menu-item" @click.stop="onMoveClick">Move...</button>
      <button class="note-menu-item" @click.stop="onDeleteClick">Delete...</button>
      <!-- <button class="note-menu-item" v-for="i in 100">button {{ i }}</button> -->
    </div>

    <div v-if="isMoving" class="note-menu">
      <div class="note-menu-header">
        <button @click.stop="isMoving = false">&lsaquo;</button>
        Move to...
      </div>
      <div class="note-menu-body">
        <button 
          v-for="file in projects"
          class="note-menu-item note-menu-item-left"
          @click.stop="moveToFile(file)"
        >{{ file }}</button>
      </div>
      <div class="note-menu-footer">
        <button class="note-menu-item" @click.stop="onNewFileClick">New file...</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-menu-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 1em;
}

.note-menu {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,.4);
  min-width: 200px;
  margin: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.note-menu-header {
  display: block;
  width: 100%;
  background: white;
  border: none;
  padding: 1em;
  box-shadow: 0 1px 10px rgba(0,0,0,.1);
  z-index: 2;
}

.note-menu-header button {
  border: none;
  background: none;
}

.note-menu-footer {
  z-index: 2;
  box-shadow: 0 -1px 10px rgba(0,0,0,.1);
}

.note-menu-body {
  flex: 1;
  overflow: auto;
}

.note-menu-item {
  display: block;
  width: 100%;
  background: white;
  border: none;
  padding: 1em;
  cursor: pointer;
}

.note-menu-item:hover {
  background: #ddd;
}

.note-menu-item-left {
  text-align: left;
}
</style>