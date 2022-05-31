const router = require('express').Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

// user register route
router.post('/register', userController.register);
// user login route
router.post('/login', userController.login);
// user logout route
router.get('/logout', auth.verifyUser, userController.logout);


module.exports = router;