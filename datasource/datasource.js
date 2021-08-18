const BASE_URL = 'http://localhost:4000';
const TOKEN = require('../config/keys').api.bearer;
const WorkspacesApiDataSource = require('./workspace');
const UsersApiDataSource = require('./user');
const NotificationDataSource = require('./notification');

let params = {
    base_url: BASE_URL,
    token: TOKEN
}

let Workspaces = function ({ name = '' } = {}) {
    return new WorkspacesApiDataSource({ ...params, name });
}

let Users = function () {
    return new UsersApiDataSource(params);
}

let Notification = function({id}) {
    return new NotificationDataSource({...params, id});
}

module.exports = { Workspaces, Users, Notification };