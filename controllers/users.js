const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('пользователь не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('неверный запрос'));
      }
      return next(err);
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });

    res.status(201).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь  уже зарегистрирован'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('некорректные данные'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const editProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('пользователь не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('некорректный запрос');
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserById,
  editProfile,
  login,
};
