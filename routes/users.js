const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUserById,
  editProfile,
} = require('../controllers/users');
const { validateUser } = require('../utils/validation');

usersRouter.get('/users/me', getUserById);

usersRouter.patch('/users/me', celebrate(validateUser), editProfile);

module.exports = usersRouter;
