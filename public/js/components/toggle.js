module.exports.toggle = toggle;

function toggle(dOpts) {
  var df = {};
  df.class = 'active';
  df.triggerEl = '.js-toggle';
  df.target = function($el) {
    return $el.data('target');
  };
  dOpts = $.extend(true, df, dOpts);

  $(dOpts.triggerEl).on('click', function() {
    var $this = $(this),
      $target = $(dOpts.target($this));
    $target.toggleClass(dOpts.class);
    if (dOpts.cb) dOpts.cb($this, $target);
  });
}
