module.exports.optimized = optimized;

var rStr = '/image/upload';

function optimized(url) {
  return {
    compressed: _compress(url),
    scaled: _scale(url)
  };
}

function _compress(url) {
  return url.replace(rStr, `${rStr}/q_auto:best`);
}

function _scale(url) {
  var compressed = _compress(url);
  return {
    a: compressed.replace(rStr, `${rStr}/w_414`),
    b: compressed.replace(rStr, `${rStr}/w_760`)
  };
}
