const axios = require('axios');

class Workspace {
    constructor({ base_url, token }) {
        this._base_url = base_url;
        this._access_token = token;
    }

    async addWorkspace(workspace) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces`, workspace, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getWorkspace({ name }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${name}`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getUsers({ name }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${name}/users`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getDocuments({ name }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${name}/documents`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getDocument({ name, id }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${name}/documents/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getDocumentFile({docid,workspace}){
        try {
            let response = await axios({ url: `http://localhost:4000/workspaces/${workspace}/documents/${docid}/file`, responseType: 'stream', method: "GET" })
            // res.set({'Content-Type':'application/vnd.ms-excel'});
			response.data.pipe(res).on('error', error => {throw new Error()});
        } catch (error) {
            console.log(error);
        }
    }

    async addDocument({form,workspace}) {
        try {
            let response = await axios.post(`http://localhost:4000/workspaces/${workspace}/documents`, form, {
                headers: form.getHeaders()
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async putUser({user,workspace}){
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/users`, user, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            
        }
    }
}

module.exports = Workspace;