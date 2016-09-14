module.exports.addToQueryParam = addToQueryParam;
module.exports.getQueryParamValsFromQuery = getQueryParamValsFromQuery;
module.exports.stripFromQueryParam = stripFromQueryParam;
module.exports.stripParamFromQuery = stripParamFromQuery;
module.exports.updateUrlQuery = updateUrlQuery;

function addToQueryParam(addV, p, q) {
  var newQ;
  if (!q.length) newQ = `?${p}=${addV}`;
  else if (q.indexOf(p + '=') > -1) {
    let rStr = getQueryParamValsFromQuery(q, p).length ? '$1,' : '$1';
    newQ = q.replace(_makeQueryParamRegex(p), rStr + addV);
  } else newQ = `${q}&${p}=${addV}`;
  return updateUrlQuery(newQ);
}

function getQueryParamValsFromQuery(q, p) {
  var qp = q.match(_makeQueryParamRegex(p));
  return qp ? _getQueryParamVals(qp[0]) : [];
}

function stripFromQueryParam(stripV, p, q) {
  var qParams = q.split('&'),
    newParams = [];
  qParams.forEach(function(qParam) {
    if (qParam.indexOf(p) > -1) {
      var pVals = _getQueryParamVals(qParam);

      // Don't modify the param if sripV is not in it.
      if (pVals.indexOf(stripV) === -1) newParams.push(qParam);

      // Remove the strip value or exclude the param if it was only value.
      else if (pVals.length > 1) {
        pVals.splice(pVals.indexOf(stripV), 1);
        newParams.push(`${p}=${pVals.join(',')}`);
      }
   } else newParams.push(qParam);
  });
  return updateUrlQuery(_makeValidQuery(newParams.join('&')));
}

function stripParamFromQuery(p, q) {
  return updateUrlQuery(
    _makeValidQuery(q.replace(_makeQueryParamRegex(p), ''))
  );
}

function updateUrlQuery(q) {
  history.replaceState({}, '', window.location.pathname + q);
}

/*
 * Private funcs.
 * ----------------------------
 */

function _getQueryParamVals(qp) {
  var strippedQp = qp.slice(qp.indexOf('=') + 1);
  return strippedQp.length ? strippedQp.split(',') : [];
}

function _makeQueryParamRegex(p) {
  return new RegExp(`&?(${p}=[^&]*)`);
}

function _makeValidQuery(q) {
  var newQ = q[0] !== '?' ? `?${q}` : q;
  newQ = newQ[1] === '&' ? newQ[0] + newQ.slice(2): newQ;
  return newQ === '?' ? '' : newQ;
}
