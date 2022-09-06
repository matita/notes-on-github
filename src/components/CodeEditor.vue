<script setup lang="ts">
  defineProps<{
    value?: string
  }>();
</script>

<template>
  <textarea
    placeholder="No content"
    :value="value"
    @input.stop.prevent.capture="$emit('input', ($event.target as HTMLTextAreaElement).value)"
  ></textarea>
</template>

<style scoped>
textarea {
  display: block;
  width: 100%;
  height: 100%;
  flex: 1 0 0;
}
</style>