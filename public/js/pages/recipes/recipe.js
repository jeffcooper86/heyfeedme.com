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

function doZoomToggle() {
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

function doIngredientToggle() {
  toggle.toggle({
    triggerEl: '.js-ingredient',
    class: 'fa-star fa-star-o',
    target: function($el) {
      if ($el.hasClass('icon')) return $el;
      return $el.siblings('.icon');
    }
  });
}

doIngredientToggle();
doSearch();
doZoomToggle();
