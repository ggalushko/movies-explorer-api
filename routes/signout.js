const router = require('express').Router();
const { logout } = require('../controllers/signout');

router.post('/', logout);

module.exports = router;
