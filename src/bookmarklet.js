javascript:(function() {

  const title = document.title;
  const url = location.href;
  const text = `${title}\n${url}`;

  window.open(
    'https://matita.github.io/notes-on-github/#/?append=' + encodeURIComponent(text), 
    null, 
    'width=700,height=800'
  );

})();