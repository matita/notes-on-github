<script setup lang="ts">
  import CodeEditor from '@/components/CodeEditor.vue';
  import { useFilesStore } from '@/stores/files';
  import { debounce } from 'lodash-es';

  const props = defineProps<{
    filepath: string
  }>();

  const files = useFilesStore();
  const onFileChange = debounce((fileContent) => {
    files.updateFile(props.filepath, fileContent);
  }, 500);
</script>

<template>
  <div class="wrapper">
    <select>
      <option :value="filepath" selected>{{ filepath }}</option>
    </select>
    <CodeEditor 
      :value="files.fileContent(filepath)" 
      @input="onFileChange"
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