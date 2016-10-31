module.exports.addField = addField;
module.exports.characterLimit = characterLimit;
module.exports.clearFieldVals = clearFieldVals;
module.exports.eventSubmit = eventSubmit;
module.exports.shortcutSubmit = shortcutSubmit;

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
    $newField = $fields.last().clone(true, true);

    // Reset the field values.
    if ($newField.is('input, textarea')) $newField.val('');
    else {

      // Scope the fields so labels still focus fields correctly.
      var scope = String(Math.random()).slice(2);
      $newField.find('input, textarea').each(function(i, input) {
        var $input = $(input);
        $input.val('');
        $input.attr('id', `${_trimScope($input.attr('id'))}_scope_${scope}`);
      });
      $newField.find('label').each(function(i, label) {
        var $label = $(label),
          val = _trimScope($label.attr('for'));
        if (val) $label.attr('for', `${val}_scope_${scope}`);
      });
    }

    $fieldsWrap.append($newField);
  });

  function _trimScope(val) {
    var i = val ? val.indexOf('_scope_') : -1;
    return i > -1 ? val.slice(0, i) : val;
  }
}

function characterLimit(opts) {
  var $el = $('input[maxlenth], textarea[maxlength]');
  $el.on('keyup', function() {
    var $this = $(this),
      max = $this.attr('maxlength'),
      len = $this.val().length,
      $remain = $this.siblings('.js-remain');
    $remain.find('.js-remaining').html(max - len);
  });
}

function clearFieldVals($field) {
  $field.find('input, textarea').val('');
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

function shortcutSubmit(opts) {
  var $el = $(opts.el),
    $submitEl = $(opts.submitEl);

  $el.on('keydown', function(e) {
    if (_eventCommandEnter(e)) $submitEl.click();
  });
}

function _eventCommandEnter(e) {
  return (e.metaKey || e.ctrlKey) && e.keyCode === 13;
}
