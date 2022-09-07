<script setup lang="ts">
  import { Codemirror } from 'vue-codemirror'
  import { markdown } from '@codemirror/lang-markdown';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { EditorView } from 'codemirror';

  defineProps<{
    placeholder?: string,
    value?: string
  }>();

  const fullHeight = EditorView.theme({
    '&': { height: '100%' },
    '& .cm-scroller': { overflow: 'auto' },
  });

  const extensions = [
    markdown(),
    fullHeight,
    oneDark,
    EditorView.lineWrapping,
  ];
</script>

<script lang="ts">
  
</script>

<template>
  <Codemirror
    :placeholder="placeholder || ''"
    :model-value="value"
    :extensions="extensions"
  ></Codemirror>
</template>

<style scoped>

</style>