const WorkspaceDatasource = require('../datasource/datasource').Workspaces({ name: 's' });
const UserDatasource = require('../datasource/datasource').Users();
const FormData = require('form-data');
const Workspace = require('../datasource/workspace');

function isRegistered({ users, curUser }) {
    return users.find(user => user.idUser == curUser._id);
}

exports.isLogin = async (req, res, next) => {
    if (!req.user)
        return res.redirect('/');
    return next
}

exports.dashboard = async (req, res, next) => {
    let name = req.baseUrl.split('/')[1];
    let { workspace } = await WorkspaceDatasource.getWorkspace({ name });
    let { users } = await WorkspaceDatasource.getUsers({ name });

    res.locals.data = {
        workspace,
        users,
        curuser: req.user,
    }

    if (!isRegistered({ users, curUser: req.user }))
        return res.render('workspace/not joined', { layout: 'layouts/dashboard' })
    if (!workspace)
        return res.render('workspace not found <a href="/">back to home </a>')

    return res.render('dashboard', { layout: 'layouts/dashboard' })
}

exports.joinWorkspace = async (req, res, next) => {
    try {
        let { username, workspace } = req.body;
        let response = await WorkspaceDatasource.joinWorkspace({ username, workspace, level: 1 });
        res.send(response)
    } catch (error) {
        next(error);
    }
}

exports.addComment = async (req, res, next) => { }


