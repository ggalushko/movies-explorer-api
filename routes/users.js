const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  editProfile,
} = require('../controllers/users');

usersRouter.get('/users/me', getUserById);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), editProfile);

module.exports = usersRouter;
