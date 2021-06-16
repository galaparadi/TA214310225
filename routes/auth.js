var express = require('express');
var passport = require('passport');
var router = express.Router();
const UserController = require('../controller/user');

router.get('/', (res,req) => {
	res.redirect('/');
});

router.post('/auth/login', UserController.localLogin);
router.get('/auth/logout', UserController.logout);
//router.get('/auth/gdrive', null);
router.get('/auth/google', passport.authenticate('google',{ 
	scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file']}));
router.get('/auth/google/redirect', UserController.googleRedirect);

module.exports = router;
