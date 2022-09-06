<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/edit">Edit</RouterLink>
    &middot;
    <RouterLink to="/settings">Settings</RouterLink>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
