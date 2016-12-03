module.exports.addField = addField;
module.exports.characterLimit = characterLimit;
module.exports.characterLimitFields = characterLimitFields;
module.exports.characterLimitUpdate = characterLimitUpdate;
module.exports.clearFieldVals = clearFieldVals;
module.exports.eventSubmit = eventSubmit;
module.exports.fileUpload = fileUpload;
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
    if ($newField.is('input, textarea')) {
      $newField.val('');
      characterLimitUpdate($newField);
    } else {

      // Scope the fields so labels still focus fields correctly.
      var scope = String(Math.random()).slice(2);
      $newField.find('input, textarea').each(function(i, field) {
        var $field = $(field);
        $field.val('');
        $field.attr('id', `${_trimScope($field.attr('id'))}_scope_${scope}`);
        characterLimitUpdate($field);
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

function characterLimit() {
  var $el = $(characterLimitFields());
  $el.on('keyup', function() {
    characterLimitUpdate($(this));
  });
}

function characterLimitFields() {
  return 'input[maxlength], textarea[maxlength]';
}

function characterLimitUpdate($el) {
  var max = $el.attr('maxlength'),
    len = $el.val().length,
    $remain = $el.siblings('.js-remain');
  $remain.find('.js-remaining').html(max - len);
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

function fileUpload(paths) {
  $('.js-form-file').on('change', function() {
    var $this = $(this),
      $hidden = $this.siblings('input[type=\'hidden\']'),
      fileName = _fileNameFromVal($this.val()),
      filePath = `${paths[$hidden.attr('name')]}/${fileName}`;
    $hidden.val(filePath);
  });
  $('.js-form-file-x').on('click', function() {
    var $this = $(this),
      $field = $this.closest('.js-file-field'),
      $hidden = $field.find('input[type=\'hidden\']'),
      $img = $field.find('img');
    $hidden.val('');
    $img.remove();
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

function _fileNameFromVal(val) {
  val = val.replace((/\\/g), '/').split('/');
  return val[val.length - 1];
}
