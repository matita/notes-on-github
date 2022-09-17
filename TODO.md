* set dynamic height for CodeMirror (currently it's 100% but goes beyond if more lines of code than height)
* show status of current file
* improve handling of merge error
* add toasts to show error messages
* press <kbd>Esc</kbd> to hide the popup and close it when everything has been saved
* from bookmarklet add also currently selected text as blockquote
* add settings: delay ms for pushing

## Markdown editor changes
* open link when cmd+click on any URL in the text
* some styling for blockquotes (maybe)
* theme from vscode

## Cool ideas

* search asana task by typing `@asana some task title` and have the autocompletion search for it

## Done
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