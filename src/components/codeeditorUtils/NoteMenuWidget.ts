import {WidgetType} from "@codemirror/view"
import {EditorView, Decoration} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import {ViewUpdate, ViewPlugin} from "@codemirror/view"
import type {DecorationSet} from "@codemirror/view"
import { parseDate } from "@/utils/date"
import { countWords } from "@/utils/string"
import { useCurrentTimedNote } from "@/stores/currentTimedNote"
import { pinia } from "@/stores"

const NOTE_MENU_CLASS_NAME = 'cm-note-menu';
const NOTE_MENU_META_CLASS_NAME = 'cm-note-menu-meta';
const NOTE_MENU_BTN_CLASS_NAME = 'cm-note-menu-btn';

const currentTimedNote = useCurrentTimedNote(pinia);

// Taken from "Boolean Toggle Widgets" at https://codemirror.net/examples/decoration/
// Resulting example code at https://codemirror.net/examples/decoration/checkbox.js
class NoteMenuWidget extends WidgetType {
  constructor(readonly date: Date, readonly text: string) { super() }

  eq(other: NoteMenuWidget) { 
    return (
      this.date == other.date 
      && this.text == other.text
    );
  }

  toDOM() {
    let wrap = document.createElement('span')
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = NOTE_MENU_CLASS_NAME;
    wrap.style.marginLeft = '10px';

    wrap.innerHTML = 
      `<button class="${NOTE_MENU_BTN_CLASS_NAME}">...</button>` +
      `<span class="${NOTE_MENU_META_CLASS_NAME}" style="opacity: .4; font-size: .8em">` +
      ` <span class="cm-note-menu-words">w: ${countWords(this.text)}</span>`;
      `</span>`
    return wrap
  }

  ignoreEvent() { return false }
}

function noteMenus(view: EditorView) {
  const widgets = []
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.name !== 'ATXHeading2') {
          return;
        }

        const nodeText = view.state.doc.sliceString(node.from, node.to);
        const timeMatch = nodeText.match(/((\d{4})-(\d{2})-(\d{2}) )?(\d\d):(\d\d):(\d\d)/);
        
        if (!timeMatch) {
          return;
        }

        const deco = Decoration.widget({
          widget: new NoteMenuWidget(parseDate(nodeText), getNoteText(view, node.from)),
          side: 1,
        });

        widgets.push(deco.range(node.to));
      }
    })
  }
  return Decoration.set(widgets)
}


const getNoteText = (view: EditorView, pos: number) => {
  const { doc } = view.state;
  const startingLine = doc.lineAt(pos);
  const noteLines = [startingLine.text];
  const timeRegex = /^## \d\d:\d\d:\d\d/
  for (let i = startingLine.number + 1; i <= doc.lines && !timeRegex.test(doc.line(i).text); i++) {
    const lineText = doc.line(i).text;
    noteLines.push(lineText);
  }
  const noteText = noteLines.join('\n');
  return noteText;
}


export const noteMenuPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = noteMenus(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = noteMenus(update.view)
  }
}, {
  decorations: v => v.decorations,

  eventHandlers: {
    mousedown: (e, view) => {
      const target = e.target as HTMLElement
      if (target.className.indexOf(NOTE_MENU_BTN_CLASS_NAME) !== -1) {
        const pos = view.posAtDOM(target);
        const startingLine = view.state.doc.lineAt(pos);
        const from = startingLine.from;
        const text = getNoteText(view, pos);
        const to = from + text.length;

        currentTimedNote.setCurrentNote({ 
          view,
          from,
          to,
          text,
        });
      }
    }
  }
})