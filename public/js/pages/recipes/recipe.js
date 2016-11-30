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
    var icon = $triggerEl.hasClass('icon') ? $triggerEl : $triggerEl.siblings('.icon');
    if ($target.hasClass('active')) {
      icon.removeClass('fa-plus').addClass('fa-minus');
    } else {
      icon.removeClass('fa-minus').addClass('fa-plus');
    }
  }
}

doSearch();
doToggle();
