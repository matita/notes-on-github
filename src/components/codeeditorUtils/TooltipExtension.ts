import type {Tooltip} from "@codemirror/view"
import {showTooltip} from "@codemirror/view"
import {StateField} from "@codemirror/state"
import type {EditorState} from "@codemirror/state"
import {EditorView} from "@codemirror/view"

const cursorTooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#66b",
    color: "white",
    border: "none",
    padding: "2px 7px",
    borderRadius: "4px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b"
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent"
    },
    '& a': {
      color: 'white',
      textDecoration: 'none',
    },
  }
})

function getCursorTooltips(state: EditorState): readonly Tooltip[] {
  const tooltips: Tooltip[] = [];
  const urlRegex = /https?:\/\/.*?(?:\s|\.\W|\n|$)/g

  state.selection.ranges.forEach((range) => {
    if (!range.empty) {
      return;
    }

    const line = state.doc.lineAt(range.head);
    const indexInLine = range.head - line.from;
    const urlMatches = line.text.matchAll(urlRegex);

    let url: string = '';
    for (const match of urlMatches) {
      const matchIndex = match.index as number;
      if (indexInLine >= matchIndex && indexInLine < matchIndex + match[0].length) {
        url = match[0];
        break;
      }
    }

    if (!url) {
      return;
    }

    tooltips.push({
      pos: range.head,
      above: true,
      strictSide: true,
      arrow: true,
      create: () => {
        const dom = document.createElement("div")
        dom.className = "cm-tooltip-cursor"

        const link = document.createElement('a');
        link.rel = 'noopener';
        link.target = '_blank';
        link.href = url;
        link.textContent = 'Open URL';
        dom.appendChild(link);
        
        return {dom}
      }
    });
  });

  return tooltips;
}

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,

  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips
    return getCursorTooltips(tr.state)
  },

  provide: f => showTooltip.computeN([f], state => state.field(f))
})

export function cursorTooltip() {
  return [cursorTooltipField, cursorTooltipBaseTheme]
}