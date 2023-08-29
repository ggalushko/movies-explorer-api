const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthError('Необходима авторизация'));
  }
  try {
    payload = jwt.verify(token, 'secret-key');
    req.user = payload;
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  next();
};
