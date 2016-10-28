module.exports.destroyEl = destroyEl;
module.exports.eventChange = eventChange;
module.exports.flash = flash;
module.exports.flashRemove = flashRemove;
module.exports.loadingStart = loadingStart;
module.exports.loadingStop = loadingStop;
module.exports.updateBroserHistory = updateBroserHistory;

function destroyEl(dOpts) {
  var df = {};
  df.triggerEl = '.js-destroy';
  df.el = '.js-destroy-wrap';
  dOpts = $.extend(true, df, dOpts);

  $(dOpts.triggerEl).on('click', function(e) {
    e.preventDefault();
    var $this = $(e.target);
    _onTrigger($this);
  });

  function _onTrigger($triggerEl) {
    var $el = typeof dOpts.el === 'function' ?
      dOpts.el($triggerEl) : $(dOpts.el);
    $el.remove();
  }
}

function eventChange(opts) {
  var $el = $(opts.el),
    cb = opts.cb;

  $el.on('change', function(e) {
    e.preventDefault();
    cb($(this), opts);
  });
}

function flash(opts) {
  var $container = $(opts.container || '.site-content'),
    $flash = $container.find('.m-flash-messages'),
    $el = $flash.find(opts.el),
    type = opts.type,
    msg = opts.msg,
    newFlash;

  // Ensure the flash message container el exists.
  if (!$flash.length) {
    $flash = $('<div>').addClass('m-flash-messages');
    newFlash = true;
  }

  // Update the message in the flash message el.
  if (!$el.length) {
    $el = $('<div>');
    _updateEl();
    $flash.append($el);
  } else _updateEl();

  // If there weren't flash messages in the dom before, add them.
  if (newFlash) $container.prepend($flash);

  function _updateEl() {
    $el.removeClass()
      .addClass(`fmm-message ${type} ${opts.el.slice(1)}`)
      .html(msg);
  }
}

function flashRemove(opts) {
  var $container = $(opts.container || '.site-content'),
    $flash = $container.find('.m-flash-messages'),
    $el = $flash.find(opts.el);

  if ($flash.find('.fmm-message').length === 1) $flash.remove();
  else $el.remove();
}

function loadingStart($el) {
  $el.addClass('ui-loading');
}

function loadingStop($el) {
  $el.removeClass('ui-loading');
}

function updateBroserHistory(url) {
  window.history.replaceState({}, '', url || window.location.pathname);
}
