exports = module.exports = function(req, res, next) {
  if (req.method.toLowerCase() === 'post' &&
    req.body.password === process.env.ADMIN_ACCESS) {
    req.session.auth = true
    return res.redirect(req.query.ref);
  }
  return res.render('auth');
};
