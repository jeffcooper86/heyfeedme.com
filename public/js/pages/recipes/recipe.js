var search = require('../../modules/search');

search.init({
  updateSearch: updateSearch
});

function updateSearch(s) {
  window.location = `/?search=${s}`;
}
