<script setup lang="ts">
  import CodeEditor from '@/components/CodeEditor.vue';
  import { useFilesStore } from '@/stores/files';
  import { debounce } from 'lodash-es';
  import { watch, computed } from 'vue';

  const props = defineProps<{
    filepath: string
  }>();

  const files = useFilesStore();
  const file = computed(() => files.fileContent(props.filepath));

  const onFileChange = debounce((fileContent) => {
    files.updateFile(props.filepath, fileContent);
  }, 500);


  watch(
    () => props.filepath,
    (newFilepath) => {
      files.fetchFile(newFilepath);
    },
    {
      immediate: true,
    }
  );
</script>

<template>
  <div class="wrapper">
    <select>
      <option :value="filepath" selected>{{ filepath }}</option>
    </select>
    <div class="editor-wrapper">
      <CodeEditor 
        :placeholder="file?.isLoading ? 'Loading' : 'No content'"
        :value="file?.remoteContent || ''" 
        @input="onFileChange"
      ></CodeEditor>
    </div>
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

.editor-wrapper {
  flex: 1;
}
</style>