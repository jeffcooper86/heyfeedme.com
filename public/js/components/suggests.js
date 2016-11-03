module.exports.autoSuggest = autoSuggest;

function autoSuggest(dOpts) {
  var df = {};
  df.suggestClass = 'js-suggest';
  df.cancelKeys = ['Escape', 'Tab', 'Enter'];
  df.hideOnSelection = true;
  df.allowTyping = true;
  df.noDuplicates = false;

  dOpts = $.extend(true, df, dOpts);
  var $el = $(dOpts.el),
    suggestClass = dOpts.suggestClass,
    cancelKeys = dOpts.cancelKeys,
    hideOnSelection = dOpts.hideOnSelection,
    allowTyping = dOpts.allowTyping,
    noDuplicates = dOpts.noDuplicates,
    loadingStart = dOpts.loadingStart,
    loadingStop = dOpts.loadingStop,
    eventScope = 0;

  $el.on('focusin', function(e) {
    var $this = $(this),
      $suggestTarget = $(e.target),
      suggestOpts = {
        ref: $this.data('ref'),
        $suggestTarget: $suggestTarget
      };
    $suggestTarget.attr('autocomplete', 'off');
    _suggest(suggestOpts);
    if (!allowTyping) {
      _setCursorToEnd($suggestTarget[0]);
    }
  });

  function _buildSuggester($target) {
    var $suggest,
      eventData;
    $suggest = $('<div>').addClass(`suggest active ${suggestClass}`);
    if (loadingStart) loadingStart($suggest);
    $target.after($suggest);

    eventData = {
      $suggestTarget: $target,
      $suggest: $suggest
    };

    _setSuggesterListener(eventData);
    // $(document).one('click keydown keyup', eventData, _suggesterEvent);
    return $suggest;
  }

  function _getHiddenTarget($suggestTarget) {
    var id = `ref${$suggestTarget[0].id}`,
      $siblings = $suggestTarget.siblings(),
      $hiddenTarget;

    // Id's are dot scoped so normal selector won't work.
    // Ex: id = ingredients.recipe
    $siblings.each(function(i, sib) {
      if (sib.id === id) $hiddenTarget = $(sib);
    });
    return $hiddenTarget;
  }

  function _getUsedVals(opts) {
    var $suggestTarget = opts.$suggestTarget,
      $suggestWrap = $suggestTarget.closest(dOpts.el),
      $vals = $suggestWrap.find('input[type=hidden]'),
      vals = [];

    $vals.each(function(i, val) {
      vals.push(val.value);
    });
    return vals;
  }

  function _removeSuggester($suggest, s) {
    $(document).off(`click.${s} keydown.${s} keyup.${s}`, _suggesterEvent);
    $suggest.remove();
  }

  function _setCursorToEnd(input) {
    var val = input.value;

    // https://bugs.chromium.org/p/chromium/issues/detail?id=32865
    window.setTimeout(function() {
      input.setSelectionRange(val.length, val.length);
    }, 0);
  }

  function _setSuggesterListener(data) {
    var s = eventScope;
    data.eventScope = s;
    $(document).on(`click.${s} keydown.${s} keyup.${s}`, data, _suggesterEvent);
    eventScope++;
  }

  function _suggest(opts) {
    var usedVals;
    _buildSuggester(opts.$suggestTarget);
    if (noDuplicates) usedVals = _getUsedVals(opts);
    $.ajax({
      url: `/api/${opts.ref}s`,
      data: {
        skip: JSON.stringify(usedVals)
      }
    }).done(function(data) {
      _updateSuggester(JSON.parse(data), opts.$suggestTarget);
    });
  }

  function _suggesterEvent(e) {
    var $target = $(e.target),
      $suggestTarget = e.data.$suggestTarget,
      $hiddenTarget = _getHiddenTarget($suggestTarget),
      $suggest = e.data.$suggest,
      data = {
        $suggestTarget: $suggestTarget,
        $target: $target,
        $hiddenTarget: $hiddenTarget
      };

    // The event was on the visible target input.
    if ($target[0] === $suggestTarget[0]) {
      if (e.type === 'keydown' && cancelKeys.indexOf(e.key) > -1) {
        _removeSuggester($suggest, e.data.eventScope);
        e.preventDefault();

      } else if (e.type === 'keyup' && allowTyping) {
        $hiddenTarget.val($suggestTarget.val());

      } else if (e.type === 'keydown' && !allowTyping) {
        e.preventDefault();
        if ('Delete Backspace'.split(' ').indexOf(e.key) > -1) {
          $hiddenTarget.val($suggestTarget.val('').val());
        }

      } else if (e.type === 'click' && !allowTyping) {
        _setCursorToEnd($target[0]);
      }
      return;
    }

    // Somewhere outside was clicked.
    if (!$target.hasClass('js-suggest-item')) {
      e.preventDefault();
      _removeSuggester($suggest, e.data.eventScope);

      // The suggester was clicked.
    } else {
      _updateSuggestData(data);
      if (hideOnSelection) _removeSuggester($suggest, e.data.eventScope);
    }
  }

  function _updateSuggestData(opts) {
    var $suggestTarget = opts.$suggestTarget,
      $target = opts.$target,
      $hiddenTarget = opts.$hiddenTarget;

    $suggestTarget.val($target.html());
    $hiddenTarget.val($target.data('hidden-val'));
  }

  function _updateSuggester(data, $target) {
    var $suggest,
      $opts;

    $suggest = $target.siblings(`.${dOpts.suggestClass}`);
    if (!$suggest.length) return;

    $opts = $('<ul>');
    data.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    data.forEach(function(d) {
      $opts.append($('<li>')
        .addClass('suggest-item js-suggest-item')
        .attr('data-hidden-val', d._id)
        .html(d.name));
    });
    if (loadingStop) loadingStop($suggest);
    $suggest.append($opts);

    if (!data.length) {
      var $noOpts = $('<div>').addClass('suggest-none').html('No options');
      $suggest.append($noOpts);
    }

    $target.after($suggest);
    return $suggest;
  }
}
