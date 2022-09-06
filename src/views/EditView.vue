<script setup lang="ts">
  import CodeEditor from '@/components/CodeEditor.vue';
  import { useFilesStore } from '@/stores/files';

  defineProps<{
    filepath: string
  }>();

  const files = useFilesStore();
</script>

<template>
  <div class="wrapper">
    <select>
      <option :value="filepath" selected>{{ filepath }}</option>
    </select>
    <CodeEditor 
      :value="files.fileContent(filepath)" 
      @input="files.updateFile(filepath, $event)"
    ></CodeEditor>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filepath {
  opacity: .8;
  padding: .4rem 1rem;
}
</style>