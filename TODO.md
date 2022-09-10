* set dynamic height for CodeMirror (currently it's 100% but goes beyond if more lines of code than height)
* show status of current file
* add toasts to show error messages
* handle conflicts with remote file
* add settings:
  * default first file (`notes/YYYY-MM-DD.md` by default)
  * delay ms for pushing
  * template for new notes (default `## hh:mm:ss\n\n`)
  * separator for new notes (default `\n\n-----\n`)
* prevent closing the the window if it's still saving
* press <kbd>Esc</kbd> to hide the popup and close it when everything has been saved
* from bookmarklet add also currently selected text as blockquote

## Markdown editor changes
* underline for URLs that are not a link
* open link when cmd+click on any URL in the text
* some styling for blockquotes (maybe)
* theme from vscode

## Cool ideas

* search asana task by typing `@asana some task title` and have the autocompletion search for it

## Done
* ~~append title and url of current page from bookmarklet~~
* ~~append some text to current note when `?append=some+text` is sent in the query string~~
* ~~bookmarklet to open the note at the current day~~
* ~~change title of index.html~~
* ~~publish project on GH pages~~
* ~~some times the sha is desyncronized and after some edits it says "Invalid request.\n\n\"sha\" wasn't supplied."~~
* ~~update content on GitHub~~
* ~~make file data structure with `{ isLoading, localContent, remoteContent, sha }` etc.~~
* ~~use CodeMirror instead of textarea~~