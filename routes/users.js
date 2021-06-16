var express = require('express');
var passport = require('passport');
var router = express.Router();
const UserController = require('../controller/user');
const { fileList } = require('../lib/googledrive');

router.get('/', function (req, res) {
  res.redirect("/");
});

router.post('/dojoin', UserController.joinWorkspace, function (req, res) {
  //TODO 
  res.redirect('/?join=join workspace sukses');
})

router.get('/join', UserController.render);

router.get('/register', UserController.render);

router.post('/register', UserController.register);

router.get('/register-google', UserController.render);

router.post('/doregister', UserController.register);

// ============CUSTOM LOCAL LOGIN AUTHENTICATION===========
router.post('/auth/login', UserController.localLogin);

// auth logout
router.get('/auth/logout', UserController.logout);

router.get('/auth/gdrive', passport.authenticate('google-drive', { scope: ['https://www.googleapis.com/auth/drive.metadata.readonly'] }))
router.get('/auth/gdrive/redirect', passport.authenticate('google-drive', { session: false }), async (req, res) => {
  let data = await fileList(req.user.accessToken);
  console.log(data);
  res.redirect('/')
});

router.get('/auth/google/redirect', UserController.googleRedirect);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
  accessType: 'offline',
  approvalPrompt: 'force'
}));



module.exports = router;
