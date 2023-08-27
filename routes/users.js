const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  editProfile,
} = require('../controllers/users');

usersRouter.get('/me', getUserById);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), editProfile);

module.exports = usersRouter;
