<script setup lang="ts">
  import CodeEditor from '@/components/CodeEditor.vue';
  import { useFilesStore } from '@/stores/files';
  import { useSettings } from '@/stores/settings';
  import { watch, computed, ref, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const props = defineProps<{
    filepath: string
  }>();

  const settings = useSettings();
  const files = useFilesStore();
  const file = computed(() => files.getFile(props.filepath));
  const route = useRoute();
  const router = useRouter();
  const selection = ref<[number, number?]>();

  const onFileChange = (fileContent: string) => {
    files.updateFileContent(props.filepath, fileContent);
  };

  watch(
    () => props.filepath,
    async (newFilepath) => {
      const viewedDate = settings.dateFromFile(newFilepath);
      settings.setViewedDate(viewedDate);
      await files.fetchFile(newFilepath);
      
      let cursor = -1;
      let endCursor = -1;
      const { append } = route.query;
      if (typeof append !== 'undefined') {
        const { formattedNewNoteTemplate, formattedSeparator } = settings;

        const valueToAppend = (append || '') as string;
        const indexOfValue = formattedNewNoteTemplate.indexOf('{value}');
        const finalValue = formattedNewNoteTemplate.replace('{value}', valueToAppend);
        const content = files.getFileContent(newFilepath);
        const prefix = content?.trim()
          ? content + formattedSeparator
          : '';
        const newContent = prefix + finalValue;
        cursor = (prefix.length) 
          + (indexOfValue === -1 ? finalValue.length : indexOfValue);
        endCursor = cursor + valueToAppend.length;

        files.updateFile(newFilepath, { localContent: newContent });
        router.replace({ path: route.path, query: {} });
      }
      
      nextTick(() => {
        if (cursor === -1) {
          const file = files.getFile(newFilepath);
          cursor = file?.localContent?.length || 0;
          endCursor = cursor;
        }
        
        selection.value = [cursor, endCursor];
        const scroller = document.querySelector('.cm-scroller');
        scroller?.scrollTo(0, scroller?.scrollHeight);
      });
    },
    {
      immediate: true,
    }
  );

  const onFileSelected = (payload: Event) => {
    const newFilePath = (payload.target as HTMLSelectElement).value;
    if (!newFilePath) {
      return;
    }
    router.push(`/edit/${newFilePath}`);
  };
</script>

<template>
  <div class="wrapper">
    <select @input="onFileSelected">
      <option value="">-- Select file --</option>
      <option 
        v-for="file in files.listFiles"
        :value="file"
        :selected="file === filepath"
      >
        {{ file }}
      </option>
    </select>
    <div class="editor-wrapper">
      <CodeEditor 
        :placeholder="file?.isPulling ? 'Loading' : 'No content'"
        :value="files.getFileContent(props.filepath) || ''" 
        :disabled="file?.isPulling"
        :selection="selection"
        autofocus
        full-height
        @change="onFileChange"
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
  overflow: auto;
  position: relative;
}
</style>