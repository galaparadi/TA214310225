var express = require('express');
var router = express.Router();
var HomeController = require('../controller/home');

router.get('/',
  HomeController.isLogin,
  HomeController.setNotifications,
  HomeController.setFeeds,
  HomeController.render
);

router.post('/', (req,res) => {
  console.log(req.headers);
  res.json({message: "nothing here"});
});

router.put('/', (req,res) => {
  res.send({message: "nothing herer"})
});

module.exports = router;