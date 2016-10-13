var cookies = require('../utils/cookies');
var urlQuery = require('../utils/url-query');

module.exports.doFilters = doFilters;

function doFilters(opts) {
  var afterUpdate = opts.afterUpdate,
    updateUrl = opts.updateUrl,
    $el = $(opts.el);

  $el.on('click', function() {
    var $this = $(this),
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');

    // Reset the filter to all.
    if (filter === 'all') {
      $this.addClass('active').siblings().removeClass('active');
      cookies.setCookie(param, ['all']);
    } else {
      $this.toggleClass('active');

      // Add the filter.
      if ($this.hasClass('active')) {
        $this.siblings('[data-filter=all]').removeClass('active');
        cookies.addValToCookieArray(param, filter);

        // Remove the filter.
      } else {
        if (!$this.siblings('.active').length) {
          $this.siblings('[data-filter=all]').addClass('active');
        }
        cookies.removeValFromCookieArray(param, filter, ['all']);
      }
    }

    if (updateUrl) _updateUrlQueryFromCookie(param);
    if (afterUpdate) afterUpdate($this, opts);
  });
}

/*
 * Private funcs.
 * ----------------------------
 */

function _updateUrlQueryFromCookie(name) {
  var cookieV = cookies.getCookie(name);

  // Remove the param from the query if the cookie is set to all.
  if ((cookieV.length === 1 && cookieV[0] === 'all')) cookieV = [];

  return urlQuery.updateUrlQuery(
    urlQuery.updateQueryParam(window.location.search, name, cookieV)
  );
}
