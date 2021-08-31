const WorkspaceDatasource = require('../datasource/datasource').Workspaces({ name: 's' });
const UserDatasource = require('../datasource/datasource').Users();
const FormData = require('form-data');
const Workspace = require('../datasource/workspace');

exports.joinWorkspace = async (req, res, next) => {
  try {
    let { username, workspace } = req.body;
    console.log(req.params);
    await WorkspaceDatasource.joinWorkspace({ username, workspace, level: 1 });
    res.send({ status: 1 })
  } catch (error) {
    next(error);
  }
}

exports.addDocumentVersion = async (req, res, next) => {
  try {
    let name = req.baseUrl.split('/')[1];
    const Workspace = require('../datasource/datasource').Workspaces({ name });
    let { docid } = req.params;
    let form = new FormData();
    // form.append('user-level', req.body['user-level']);
    form.append('workspace', name);
    form.append('author', req.user.username);
    form.append('filename', req.body['file-name']);
    form.append('documentId', req.body['document-id']);
    form.append('file', req.file.buffer, req.body['file-name']);
    form.append('note', req.body['version-note']);
    await Workspace.addDocumentVersion({ form, workspace: name, documentId: docid });
    res.send({ status: 1 })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.addComment = async (req, res, next) => {
  try {
    let { documentId, comment } = req.body;
    let sender = req.user.username;
    let workspace = req.baseUrl.split('/')[1];
    await WorkspaceDatasource.addComments({ workspace, documentId, comment, sender });
    res.send({ status: 1 })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.addUser = async (req, res, next) => {
  try {
    let { username, workspace, level } = req.body;
    await WorkspaceDatasource.addUser({ username, workspace, level })
    res.send({ status: 1 })
  } catch (error) {
    next(error);
  }
}

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
    await UserDatasource.updateUser({ user: user, username: req.user.username });
    res.cookie('setting', {
      register: true,
    }, { expires: new Date(Date.now() + 1000) });
    res.redirect('/');
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
    // next('router');
    res.redirect('/');
  }
}

exports.setNotifications = async function (req, res, next) {
  let { username: name } = req.user;
  let { notifications } = await userDataSource.getNotifications({ name });
  res.locals.data = { ...res.locals.data, notifications: notifications.map(({ content }) => ({ ...content })) }
  next();
}

exports.setFeeds = async function (req, res, next) {
  let { feeds } = await WorkspaceDatasource.getFeeds({ workspace: req.params.workspace });
  res.locals.data = { ...res.locals.data, feeds }
  next();
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
  if (res.locals.data.workspace) {
    res.locals.data.users.forEach(function (username) {
      if (username.idUser == req.user._id) {
        registered = true;
      }
    });
    if (registered) {
      path = 'dashboard';
    }
    res.locals.data.curuser = res.locals.data.users.find(user => user.username === req.user.username)
    res.locals.data.users = res.locals.data.users.filter(user => user.username !== req.user.username)
    res.render(path, { layout: 'layouts/dashboard' });
  } else {
    //TODO: make workspace not found page
    res.send('workspace not found <a href="/">back to home</a>');
  }

}

