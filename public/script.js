var form = document.querySelector('form[action="/api/fileanalyse"]');
var output = document.getElementById('output');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  var data = new FormData(form);

  output.textContent = 'Analysing...';

  fetch('/api/fileanalyse', { method: 'POST', body: data })
    .then(function (response) {
      return response.json();
    })
    .then(function (metadata) {
      output.innerHTML = '';

      if (metadata.error) {
        output.textContent = metadata.error;
        return;
      }

      var list = document.createElement('dl');

      Object.keys(metadata).forEach(function (key) {
        var term = document.createElement('dt');
        term.textContent = key;
        var value = document.createElement('dd');
        value.textContent = metadata[key];
        list.appendChild(term);
        list.appendChild(value);
      });

      output.appendChild(list);
    })
    .catch(function (error) {
      output.textContent = 'Upload failed: ' + error.message;
    });
});