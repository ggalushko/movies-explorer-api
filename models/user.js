const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = async function (
  email,
  password,
  next,
) {
  try {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      return Promise.reject(
        new AuthError('Неправильные почта или пароль'),
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return Promise.reject(
        new AuthError('Неправильные почта или пароль'),
      );
    }

    return user;
  } catch (err) {
    next(err);
  }
};

module.exports = mongoose.model('user', userSchema);
