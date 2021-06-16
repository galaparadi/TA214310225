const BASE_URL = 'http://localhost:4000';
const TOKEN = require('../config/keys').api.bearer;
const WorkspacesApiDataSource = require('./workspace');
const UsersApiDataSource = require('./user');

let params = {
    base_url: BASE_URL,
    token: TOKEN
}

let Workspaces = function(){
    return new WorkspacesApiDataSource(params);
}

let Users = function(){
    return new UsersApiDataSource(params);
}

module.exports = {Workspaces, Users};