<script setup lang="ts">
  import { Codemirror } from 'vue-codemirror'
  import { markdown } from '@codemirror/lang-markdown';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { EditorView } from 'codemirror';
  import { EditorSelection } from '@codemirror/state';
  import { MarkdownUrl } from './codeeditorUtils/MarkdownUrlParser';
  import { cursorTooltip } from './codeeditorUtils/TooltipExtension';
  import { ref, watch } from 'vue';
  import { noteMenuPlugin } from './codeeditorUtils/NoteMenuWidget';

  const props = defineProps<{
    placeholder?: string,
    value?: string,
    selection?: [number, number?],
    autofocus?: boolean,
    disabled?: boolean,
    fullHeight?: boolean,
  }>();

  const fullHeightTheme = EditorView.theme({
    '&': { height: props.fullHeight ? '100%' : '' },
    '& .cm-scroller': { 
      fontFamily: 'Consolas, monospace',
      overflow: 'auto', 
      paddingBottom: props.fullHeight ? '50vh' : '',
    },
  });


  const extensions = [
    markdown({
      extensions: [
        MarkdownUrl,
      ]
    }),
    fullHeightTheme,
    oneDark,
    EditorView.lineWrapping,
    ...cursorTooltip(),
    noteMenuPlugin,
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
    :class="{ 'full-height': fullHeight }"
    :placeholder="placeholder || ''"
    :model-value="value"
    :extensions="extensions"
    :autofocus="autofocus"
    :disabled="disabled"
    @ready="handleReady"
  ></Codemirror>
</template>

<style scoped>
.v-codemirror.full-height {
  display: block!important;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>