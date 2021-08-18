const axios = require('axios');

class User {
    constructor({ base_url, token }) {
        this._base_url = base_url;
        this._access_token = token;
    }

    async addUser({ user }) {
        try {
            let response = await axios.post(`${this._base_url}/users`,
                { user },
                {
                    headers: {
                        'Authorization': `Bearer ${this._access_token}`
                    }
                })
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async authUser(user) {
        try {
            let response = await axios.post(`${this._base_url}/auth/user/`,
                { user },
                {
                    headers: {
                        'Authorization': `Bearer ${this._access_token}`
                    }
                })
            return response.data;
        } catch (error) {
            console.log("authUser() Error : " + error.message);
            console.log(error.response.data);
            return { user: null, message: error.response.data.message }
        }
    }

    async authGoogleUser({ googleId }) {
        try {
            let response = await axios.post(`${this._base_url}/auth/googleuser/`,
                { googleId },
                {
                    headers: {
                        'Authorization': `Bearer ${this._access_token}`
                    }
                })
            return response.data;
        } catch (error) {
            console.log("authGoogleUser() Error : " + error.message);
            console.log(error.response.data);
            return { user: null, message: error.response.data.message }
        }
    }

    async getUser({ username }) {
        try {
            let response = await axios.get(`${this._base_url}/users/${username}`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            return {error}
        }
    }

    async getWorkspaces({ username }) {
        try {
            let response = await axios.get(`${this._base_url}/users/${username}/workspaces`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error.message);
            console.log(error.data);
        }
    }

    async confirmNotif({ notifId }) {
        try {
            /*
                1. cek notifikasi type
                2. eksekusi notif berdasarkan action
            */
            let { data } = await axios.put(`${this._base_url}/notif/${notifId}/action`, {}, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return data;
        } catch (error) {
            console.log(error.message)
            console.log(error.data)
        }
    }

    async updateUser({ user }) {
        try {
            let response = await axios.put(`${this._base_url}/users/${user.username}`, user, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            })
            return response.data;
        } catch (error) {

        }
    }

    async getFeeds({ name }) {
        try {
            let response = await axios.get(`${this._base_url}/users/${name}/feeds`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @param {name} name name of username
     * @returns 
     */
    async getNotifications({ name }) {
        try {
            let { data } = await axios.get(`${this._base_url}/users/${name}/notifications`);
            return data;
        } catch (error) {

        }
    }
}

module.exports = User;
