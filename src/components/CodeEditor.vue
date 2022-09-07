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

  const onChange = (value: string) => {
    console.log(value);
  } 

  const handleReady = ({ view } : { view:EditorView }) => {
    
  }
</script>

<script lang="ts">
  
</script>

<template>
  <Codemirror
    :placeholder="placeholder || ''"
    :model-value="value"
    :extensions="extensions"

    @ready="handleReady"
    @change="onChange"
  ></Codemirror>
</template>

<style scoped>

</style>