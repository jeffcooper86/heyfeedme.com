var search = require('../../modules/search');

search.init({
  updateSearch: updateSearch
});

function updateSearch(s) {
  console.log('update search');
  window.location = `/?search=${s}`;
}
