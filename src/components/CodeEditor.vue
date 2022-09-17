<script setup lang="ts">
  import { Codemirror } from 'vue-codemirror'
  import { markdown } from '@codemirror/lang-markdown';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { EditorView } from 'codemirror';
  import { EditorSelection } from '@codemirror/state';
  import { MarkdownUrl } from './codeeditorUtils/MarkdownUrlParser';
  import { cursorTooltip } from './codeeditorUtils/TooltipExtension';
import { ref, watch } from 'vue';

  const props = defineProps<{
    placeholder?: string,
    value?: string,
    selection?: [number, number?],
    autofocus?: boolean,
    disabled?:boolean,
  }>();

  const fullHeight = EditorView.theme({
    '&': { height: '100%' },
    '& .cm-scroller': { overflow: 'auto' },
  });


  const extensions = [
    markdown({
      extensions: [
        MarkdownUrl,
      ]
    }),
    fullHeight,
    oneDark,
    EditorView.lineWrapping,
    ...cursorTooltip(),
  ];

  const editorView = ref<EditorView>();
  watch(
    () => props.selection,
    (newSelection) => {
      if (newSelection) {
        const selection = EditorSelection.range(newSelection[0], newSelection[1] ?? newSelection[0]);
        editorView.value?.focus();
        editorView.value?.dispatch({ selection });
      }
    }
  );

  const handleReady = ({ view } : { view:EditorView }) => {
    editorView.value = view;
  };
</script>

<template>
  <Codemirror
    :placeholder="placeholder || ''"
    :model-value="value"
    :extensions="extensions"
    :autofocus="autofocus"
    :disabled="disabled"
    @ready="handleReady"
  ></Codemirror>
</template>

<style scoped>

</style>