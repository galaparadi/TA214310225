const axios = require('axios');

class Workspace {
    constructor({ base_url, token, name = "i" }) {
        this._base_url = base_url;
        this._access_token = token;
        this._name = name;
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
            return { error }
        }
    }

    async addUser({ }) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/users`, workspace, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error.message);
            return { error }
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
            return { error }
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
            return { error }
        }
    }

    async getChats(data) {
        try {
            let response = await axios.get(`${this._base_url}/chats/${data.username}?workspace=${data.workspace}&username=${data.receiver}`);
            return response.data;
        } catch (error) {
            console.log(error.message);
            return { error }
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
            return { error }
        }
    }

    async joinWorkspace({ workspace, username, level = 1 }) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/join`, { username, workspace, level }, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
            return { error }
        }
    }

    /**
     * 
     * @param {Object} param0 {name, id}
     * @returns {Promise} data = {name, id}
     */
    async getDocument({ name, id }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${name}/documents/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error.message);
            return { error }
        }
    }

    async getDocumentFile({ docid, workspace }) {
        try {
            let response = await axios({ url: `http://localhost:4000/workspaces/${workspace}/documents/${docid}/file`, responseType: 'stream', method: "GET" })
            // res.set({'Content-Type':'application/vnd.ms-excel'});
            response.data.pipe(res).on('error', error => { throw new Error() });
        } catch (error) {
            console.log(error);
            return { error }
        }
    }

    async addDocument({ form, workspace, authorLevel }) {
        try {
            //TODO: handle if author is non-admin user
            if (authorLevel == 0) {
                let response = await axios.post(`http://localhost:4000/workspaces/${workspace}/documents`, form, {
                    headers: form.getHeaders(),
                    'maxContentLength': Infinity,
                    'maxBodyLength': Infinity,
                })
                return response.data;
            } else {
                let response = await axios.post(`http://localhost:4000/workspaces/${workspace}/documents/submit`, form, {
                    headers: form.getHeaders(),
                    'maxContentLength': Infinity,
                    'maxBodyLength': Infinity,
                })
                return response.data;
            }
        } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', error.message);
            return { error }
        }
    }

    async putUser({ user, workspace }) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/users`, user, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return { error }
        }
    }

    async getComments({ workspace, documentId }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${workspace}/documents/${documentId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return { error }
        }
    }

    async addComments({ workspace, documentId, comment, sender }) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/documents/${documentId}/comments`, {
                workspace,
                documentId,
                comment,
                sender
            }, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return { error }
        }
    }

    async getDocumentVersions({ documentId }) {
        try {
            let response = await axios.get(`${this._base_url}/workspaces/${this._name}/documents/${documentId}/versions/1`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.dir({ message: error.message, stack: error.stack });
            return { error }
        }
    }

    /**
     * 
     * @param {Object} param0 {form, documentName, workspaceName}
     * @returns 
     */
    async addDocumentVersion({ form, workspace, documentId }) {
        try {
            let response = await axios.post(`${this._base_url}/workspaces/${workspace}/documents/${documentId}/versions/submit`, form, {
                headers: form.getHeaders()
            })
            return response.data;
        } catch (error) {
            console.log({ message: error.message, stack: error.stack });
            return { error }
        }
    }
}

module.exports = Workspace;