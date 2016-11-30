var search = require('../../modules/search');
var toggle = require('../../components/toggle');

function doSearch() {
  search.init({
    updateSearch: updateSearch
  });

  function updateSearch(s) {
    window.location = `/?search=${s}`;
  }
}

function doToggle() {
  toggle.toggle({
    triggerEl: '.js-zoom',
    cb: onToggle
  });

  function onToggle($triggerEl, $target) {
    if ($target.hasClass('active')) {
      $triggerEl.removeClass('fa-plus').addClass('fa-minus');
    } else {
      $triggerEl.removeClass('fa-minus').addClass('fa-plus');
    }
  }
}

doSearch();
doToggle();
