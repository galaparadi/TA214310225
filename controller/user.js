const userDataSource = require('../datasource/datasource').Users();
const workspaceDataSource = require('../datasource/datasource').Workspaces();
const passport = require('passport');

exports.localLogin = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log(info);
      res.cookie('error', info.status, { expires: new Date(Date.now() + 10) })
      return res.redirect('/');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
}

exports.getNotifications = async (req, res, next) => {
  try {
    let { username: name } = req.user;
    let { notifications } = await userDataSource.getNotifications({ name })
    res.send(notifications.map(({ content }) => ({ ...content })));
  } catch (error) {
    next(error);
  }
}

exports.confirmNotif = async (req, res, next) => {
  try {
    let { notifId,  } = req.body;
    let { username } = req.params
    let response = await userDataSource.confirmNotif({ notifId, username });
    res.send({ sukses: 1, response })
  } catch (error) {
    next(error);
  }
}

exports.joinWorkspace = async (req, res, next) => {
  await workspaceDataSource.joinWorkspace({ workspace: req.body.name, username: req.user.username });  
  next();
}

exports.logout = async (req, res, next) => {
  res.clearCookie('googleUser');
  req.logout();
  res.redirect("/");
}

exports.googleRedirect = async (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if(!info) return next(err);
    if (info.registered) {
      req.login(user, async (err) => {
        return res.redirect('/')
      })
    } else {
      req.logIn(user, async (err) => {
        await userDataSource.addUser({ user: user.user });
        return res.redirect('/')
      });
    }
  })(req, res, next);
}

exports.render = (req, res, next) => {
  res.render(`profile/${req.path}`);
}

exports.redirect = (req, res, next) => {

}

exports.showProfile = async (req, res, next) => {
  try {
    res.locals.data = {};
    let { user } = await userDataSource.getUser({ username: req.params.username });
    // let { workspace } = await workspaceDataSource.getWorkspace({name: user.workspaces});
    //TODO show profile detail
    /*
      res.locals.data.user = user;
      res.locals.data.workspaces = workspaces;
    */
    if (user) {

    } else {
      res.status(404).render('profile/not found', { layout: 'layouts/error' })
    }
  } catch (error) {
    next(error);
  }
}

exports.register = async (req, res, next) => {
  let userDocument = {};

  if (req.cookies.googleUser) {
    userDocument = {
      username: req.cookies.googleUser.user.username,
      email: req.cookies.googleUser.user.email,
      password: req.cookies.googleUser.user.password,
      googleId: req.cookies.googleUser.user.googleId,
      googleAccount: true
    }
    res.clearCookie('googleUser');
  } else {
    userDocument = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      googleAccount: false
    }
  }

  try {
    let { user, message } = await userDataSource.addUser({ user: userDocument });
    if (!user) {
      if (message.includes('duplicate')) {
        res.render('profile/register', { error: { valid: 'invalid', status: 0, message: 'user sudah terdaftar' }, userDocument }) // handle if duplicate
      } else {
        // res.redirect('/') // general error
        next(err);
      }
    } else {
      req.logIn({ user }, function (error) {
        if (error) {
          return next(error);
        };
        return res.redirect('/');
      });
    }
  } catch (error) {
    return next(error);
  }
}