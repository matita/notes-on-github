<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useSettings } from './stores/settings';
import { useCurrentTimedNote } from './stores/currentTimedNote';
import NoteMenuView from './views/NoteMenuView.vue';

const settings = useSettings();
</script>

<template>
  <header>
    <RouterLink tag="button" :to="`/edit/${settings.formattedNewNoteFilepath}`">Today</RouterLink>
    &mdash;
    <RouterLink tag="button" :to="`/edit/${settings.formattedPrevNoteFilepath}`">Prev day</RouterLink>
    &middot;
    <RouterLink tag="button" :to="`/edit/${settings.formattedNextNoteFilepath}`">Next day</RouterLink>
    &mdash;
    <RouterLink to="/settings">Settings</RouterLink>
  </header>

  <RouterView />
  <NoteMenuView />
</template>

<style scoped>

</style>
