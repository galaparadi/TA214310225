var express = require('express');
var passport = require('passport');
var router = express.Router();
const UserController = require('../controller/user');
const { fileList } = require('../lib/googledrive');

router.get('/', (req, res) => res.redirect("/"))

  .post('/dojoin',
    UserController.joinWorkspace,
    (req, res) => res.redirect('/'))

  .get('/join', UserController.render)
  .get('/register', UserController.render)
  .post('/register', UserController.register)
  .get('/register-google', UserController.render)
  .post('/doregister', UserController.register);

// ============CUSTOM LOCAL LOGIN AUTHENTICATION===========
router.post('/auth/login', UserController.localLogin);

// auth logout
router.get('/auth/logout', UserController.logout);

router.get('/auth/google/redirect', UserController.googleRedirect2);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
  accessType: 'offline',
  approvalPrompt: 'force'
}));

router.get('/:username/notif',UserController.getNotifications)

router.post('/:username/notif', UserController.confirmNotif)


module.exports = router;
