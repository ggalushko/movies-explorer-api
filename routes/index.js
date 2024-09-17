const router = require('express').Router();
const { celebrate } = require('celebrate');
const usersRouter = require('./users');
const signout = require('./signout');
const NotFoundError = require('../errors/NotFoundError');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegister } = require('../utils/validation');

router.post('/signin', celebrate(validateLogin), login);
router.post('/signup', celebrate(validateRegister), createUser);

router.use(auth);

router.use('/', moviesRouter);
router.use('/', usersRouter);
router.use('/signout', signout);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Ничего не найдено'));
});

module.exports = router;
