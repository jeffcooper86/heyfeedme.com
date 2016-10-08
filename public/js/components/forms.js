module.exports.eventSubmit = eventSubmit;
module.exports.addField = addField;

function addField(opts) {
  var $el = $(opts.el);

  $el.on('click', function(e) {
    e.preventDefault();
    var $this = $(this),
      $fieldsWrap = $('.js-form-add-' + $this.data('form-add')),
      $fields = $fieldsWrap.children(),
      fieldsLength = $fields.length,
      $newField;

    if (!fieldsLength) return;
    $newField = $fields.last().clone();

    // Reset the field values.
    if ($newField.is('input, textarea')) $newField.val('');
    else {

      // Scope the fields so labels still focus fields correctly.
      var scope = String(Math.random()).slice(2);
      $newField.find('input').each(function(i, input) {
        var $input = $(input);
        $input.val('');
        $input.attr('id', `${scope}${$input.attr('id')}`);
      });
      $newField.find('label').each(function(i, label) {
        var $label = $(label);
        $label.attr('for', `${scope}${$label.attr('for')}`);
      });
    }

    $fieldsWrap.append($newField);
  });
}

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
