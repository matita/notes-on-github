* show status of current file
* improve handling of merge error
* add toasts to show error messages
* press <kbd>Esc</kbd> to hide the popup and close it when everything has been saved
* from bookmarklet add also currently selected text as blockquote
* add settings: delay ms for pushing
* list all files
* go to any file
* wiki links
* search notes
* leave space to bottom of page
* word count
* markdown keyboard on mobile
* better handling of zoom on mobile
* native autocomplete on mobile iOS (ccurrently native iOS keyboard doesn't capitalize the first letter, doesn't suggest words and it doesn't close when tapping "end"), ideally it should be handled like a setting
* improve fonts
  * on mobile it is maybe too big
  * beautiful font: https://evantravers.com/articles/2020/03/13/simple-markdown-zettelkasten/


## Markdown editor changes
* open link when cmd+click on any URL in the text
* some styling for blockquotes (maybe)
* theme from vscode

## Cool ideas
* idea: copy as formatted text, useful to copy a complex text e.g. on Teams
* idea: three-points menu beside note separator to do actions on a single sub-note, e.g.: 
  * display formatted
  * copy formatted
  * move to folder (it also renames file or append to existing file)
* search asana task by typing `@asana some task title` and have the autocompletion search for it
* compute maths similar to https://mathnotepad.com/ (powered by mathjs.org), displayed as widget decorator

## Done
* ~~set dynamic height for CodeMirror (currently it's 100% but goes beyond if more lines of code than height)~~
* ~~add bookmarklet to settings page~~
* ~~navigation to go to prev/next day~~
* ~~tooltip to open URLs~~
* ~~underline for URLs that are not a link~~
* ~~add settings:~~
  * ~~default first file (`notes/{YYYY}-{MM}-{DD}.md` by default)~~
  * ~~template for new notes (default `## {hh}:{mm}:{ss}\n\n`)~~
  * ~~separator for new notes (default `\n\n-----\n`)~~
* ~~prevent closing the the window if it's still saving~~
* ~~handle conflicts with remote file~~
* ~~append title and url of current page from bookmarklet~~
* ~~append some text to current note when `?append=some+text` is sent in the query string~~
* ~~bookmarklet to open the note at the current day~~
* ~~change title of index.html~~
* ~~publish project on GH pages~~
* ~~some times the sha is desyncronized and after some edits it says "Invalid request.\n\n\"sha\" wasn't supplied."~~
* ~~update content on GitHub~~
* ~~make file data structure with `{ isLoading, localContent, remoteContent, sha }` etc.~~
* ~~use CodeMirror instead of textarea~~