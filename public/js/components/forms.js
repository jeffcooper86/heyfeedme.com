module.exports.eventSubmit = eventSubmit;

function eventSubmit(opts) {
  var $el = $(opts.el),
    cb = opts.cb,
    $submits = $el.find('input[type=submit]');

  $el.on('submit', function(e) {
    e.preventDefault();
    cb($el);
  });
  $submits.on('click', function(e) {
    var $form = $(this).closest(opts.el);
    e.preventDefault();
    cb($form);
  });
}
