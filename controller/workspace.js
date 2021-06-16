const WorkspaceDatasource = require('../datasource/datasource').Workspaces();
const UserDatasource = require('../datasource/datasource').Users();

exports.addWorkspace = async (req, res, next) => {
  try {
    let workspaceData = {
      name: req.body.name,
      users: [
        {
          user: req.user._id,
          level: 0,
        },
      ],
    }
    let { workspace } = await WorkspaceDatasource.addWorkspace(workspaceData);
    let { user } = await UserDatasource.getUser({ username: req.user.username });
    user.workspaces.push(workspace._id);
    await UserDatasource.updateUser({ user: user, username: req.user.username })
    res.redirect('/?create=workspace created'); //look dangerous
  } catch (error) {
    next(error);
  }
}

exports.renderRegisterPage = async (req, res, next) => {
  let workspaceData = {
    name: req.body.name,
    users: [
      {
        user: req.user._id,
        level: 0,
      },
    ],
  }
  let { workspace } = await WorkspaceDatasource.addWorkspace(workspaceData);
  let { user } = await UserDatasource.getUser({ username: req.user.username });
  user.workspaces.push(workspace._id);
  await UserDatasource.updateUser({ user: user, username: req.user.username })
  res.redirect('/?create=workspace created'); //look dangerous
}

exports.skipFavicon = function (req, res, next) {
  if (req.params.workspace == 'favicon.ico') {
    next('route');
  } else {
    next();
  }
}

exports.isLogin = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    next('route');
  }
}

exports.setWorkspaceData = async function (req, res, next) {
  req.params.workspace = req.baseUrl.split('/')[1];
  let workspaceData = await WorkspaceDatasource.getWorkspace({ name: req.params.workspace });
  res.locals.data = { workspace: workspaceData.workspace, users: workspaceData.users, curuser: req.user };
  next();
}

exports.setUser = async function (req, res, next) {
  let { users } = await WorkspaceDatasource.getUsers({ name: req.params.workspace });
  res.locals.data.users = users;
  next();
}

exports.render = function (req, res) {
  var registered = false;
  var path = 'workspace/not joined';
  res.locals.data.users.forEach(function (username) {
    if (username.idUser == req.user._id) {
      registered = true;
    }
  });
  if (registered) {
    path = 'dashboard';
  }
  res.render(path, { layout: 'layouts/dashboard' });
}

exports.invite = function (req, res, next) {
  let workspace = req.user.workspace;
}

exports.changeUserRole = function (req, res, next) {
  var user = req.body.user;
  var workspace = req.body.workspace;
  // proses ubah role user
}

exports.updateWorkspace = function (req, res, next) {
  var workspace = req.body.workspace;
}

exports.addDocumentTree = function (req, res, next) {
  var workspace = req.body.workspace;
}

exports.addDocumentTree = function (req, res, next) {

}

exports.versioningDocument = function (req, res, next) {
  // body...
}
