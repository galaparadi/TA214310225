const axios = require('axios');
const userDataSource = require('../datasource/datasource').Users();

exports.isLogin = async function (req, res, next) {
  try {
    if (req.user) {
      let workspacesData = await userDataSource.getWorkspaces({ username: req.user.username });
      let feeds = (await userDataSource.getFeeds({ name: req.user.username })).feeds.map(feed => {
        feed.date = `${new Date(feed.date).getDate()}/${new Date(feed.date).getMonth()}/${new Date(feed.date).getFullYear()}`;
        return feed
      });

      Object.assign(res.locals, {
        title : 'Welcome ' + req.user.username,
        username: req.user.username,
        workspaces: workspacesData.workspaces,
        feeds: feeds,
        login: true
      });
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

exports.render = async function (req, res) {
  if(res.locals.login){
    res.render('home')
  }else{
    res.render('index')
  }
}