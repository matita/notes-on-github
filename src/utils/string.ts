import { parseDate } from "./date";

export const textToTimedNotes = (text: string, filePath: string) => {
  const chunks: string[] = [];
  let startIndex = 0;
  const dateSeparatorRegex = /(?:-+\n)?## \d+:\d+(:\d+)?/g;
  const dateMatches = text.matchAll(dateSeparatorRegex);
  for (const match of dateMatches) {
    if (typeof match.index === 'undefined') {
      continue;
    }

    const chunk = text.slice(startIndex, match.index);
    startIndex = match.index;
    chunks.push(chunk);
  }
  // Add the last chunk after all the dates have been found in the text
  chunks.push(text.slice(startIndex));

  return chunks
    // Only select the chunks with some actual text
    .filter((chunk) => !!chunk.trim())
    .map((chunk) => ({
      date: parseDate(chunk, parseDate(filePath)),
      fullText: chunk,
      content: chunk
        .replace(dateSeparatorRegex, '')
        .trim(),
    }));
}

export const countWords = (text: string) => {
  return text
    .split(/\W+/)
    .filter((w) => !!w.trim())
    .length;
}