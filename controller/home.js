const axios = require('axios');
const userDataSource = require('../datasource/datasource').Users();

exports.isLogin = async function (req, res, next) {
  try {
    if (req.user) {
      let { workspaces } = await userDataSource.getWorkspaces({ username: req.user.username });
      let { username } = req.user;
      res.locals = { ...res.locals, title: 'Welcome ' + req.user.username, username, workspaces, login: true };
    } else {
      Object.assign(res.locals, {
        title: 'Document Management System',
        login: false
      })
    }
    next()
  } catch (error) {
    next(error);
  }
}

exports.setNotifications = async function (req, res, next) {
  try {
    if (req.user) {
      let { notifications } = await userDataSource.getNotifications({ name: req.user.username });
      res.locals = { ...res.locals, notifications: notifications.filter(notification => !notification.statusRead).map(({ _id, content, statusRead }) => ({ _id, content, statusRead })) }
      res.locals.notifications = { items: res.locals.notifications, count: res.locals.notifications.length }
    }
    next();
  } catch (error) {
    next(error);
  }
}

exports.render = async function (req, res) {
  if (res.locals.login) {
    res.render('home')
  } else {
    res.render('index')
  }
}