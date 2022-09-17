import type {MarkdownConfig} from "@lezer/markdown"
import { tags } from "@codemirror/highlight"

const UrlDelim = {resolve: "Url", mark: "Url"}

export const MarkdownUrl: MarkdownConfig = {
  defineNodes: [{
    name: 'Url',
    style: {"Url/...": tags.link}
  }, {
    name: 'UrlMark',
  }],
  parseInline: [{
    name: "Url",
    parse(cx, next, pos) {
      if (/https?:\/\//.test(cx.slice(pos, pos + 8))) {
        return cx.addDelimiter(UrlDelim, pos, pos, true, false) + 1;
      }

      if (/^(?:\s|\.\W|\n|$)/.test(cx.slice(pos + 1, pos + 3))) {
        return cx.addDelimiter(UrlDelim, pos + 1, pos + 1, false, true) + 1;
      }

      return -1;
    },
    after: "Emphasis"
  }],
};