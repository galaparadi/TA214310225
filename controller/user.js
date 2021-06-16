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
      res.cookie('error', info.status, {expires : new Date(Date.now() + 1000)})
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

exports.joinWorkspace = async (req, res, next) => {
  let { user } = await userDataSource.getUser({ username: req.user.username });
  let { workspace } = await workspaceDataSource.getWorkspace({ name: req.body.name });
  user.workspaces.push(workspace._id);
  await userDataSource.updateUser({ user: user });
  await workspaceDataSource.putUser({
    workspace: req.body.name,
    user: {
      user: user._id,
      level: 1,
      disable: true,
    }
  });
  next();
}

exports.logout = async (req, res, next) => {
  res.clearCookie('googleUser');
  req.logout();
  res.redirect("/");
}

exports.googleRedirect = async (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (info.registered) {
      req.logIn(user, (err) => {
        return res.redirect('/')
      });
    } else {
      //redirect to information update before register
      res.cookie('googleUser', user);
      return res.render('profile/register-google', { data: user });
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
      username: req.cookies.googleUser.username,
      email: req.cookies.googleUser.email,
      password: req.cookies.googleUser.password,
      googleId: req.cookies.googleUser.googleId,
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
        res.render('profile/register', {error: {valid: 'invalid', status: 0,message: 'user sudah terdaftar'},userDocument}) // handle if duplicate
      } else {
        res.redirect('/') // general error
      }
    } else {
      req.logIn(user, function (error) {
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