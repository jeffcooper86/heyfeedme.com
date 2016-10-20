module.exports.autoSuggest = autoSuggest;

function autoSuggest(opts) {
  var $el = $(opts.el),
    suggestClass = opts.suggestClass || 'js-suggest',
    cancelKeys = opts.cancelKeys || ['Escape', 'Tab'],
    hideOnSelection = opts.hideOnSelection || true;

  $el.on('focusin', function(e) {
    var $this = $(this),
      suggestOpts = {
        ref: $this.data('ref'),
        $suggestTarget: $(e.target)
      };
    _suggest(suggestOpts);
  });

  function _suggest(opts) {
    $.ajax({
      url: `/api/${opts.ref}s`
    }).done(function(data) {
      _buildSuggester(JSON.parse(data), opts.$suggestTarget);
    });
  }

  function _buildSuggester(data, $target) {
    var $suggest,
      $opts,
      eventData;

    $suggest = $('<div>').addClass(`suggest active ${suggestClass}`);
    $opts = $('<ul>');
    data.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    data.forEach(function(d) {
      $opts.append($('<li>')
        .addClass('suggest-item js-suggest-item')
        .html(d.name));
    });
    $suggest.append($opts);
    $target.after($suggest);

    eventData = {
      $suggestTarget: $target,
      $suggest: $suggest
    };

    $(document).on('click keydown', eventData, _suggesterEvent);
    return $suggest;
  }

  function _removeSuggester($suggest) {
    $(document).off('click keydown', _suggesterEvent);
    $suggest.remove();
  }

  function _suggesterEvent(e) {
    var $target = $(e.target),
      $suggestTarget = e.data.$suggestTarget,
      $suggest = e.data.$suggest;

    if ($target[0] === $suggestTarget[0]) {
      if (cancelKeys.indexOf(e.key) > -1) _removeSuggester($suggest);
      else return;
    }

    if (!$target.hasClass('js-suggest-item')) {
      _removeSuggester($suggest);
    } else {
      $suggestTarget.val($target.html());
      if (hideOnSelection) _removeSuggester($suggest);
    }
  }
}
