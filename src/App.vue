<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/edit?append">New note</RouterLink>
    &middot;
    <RouterLink to="/edit">Today</RouterLink>
    &middot;
    <RouterLink to="/settings">Settings</RouterLink>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
