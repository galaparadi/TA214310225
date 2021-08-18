const axios = require('axios');

class Notification {
    constructor({ base_url, token, id }) {
        this._base_url = base_url;
        this._access_token = token;
        this._id = id;
        this.executeAction = {
            'jw': ({ content }) => this.joinWorkspace({ content }),
            'w': () => this.ambyar(),
        }
    }

    async joinWorkspace(content) {
        try {
            let { data } = await axios.post(`${this._base_url}/workspace/${content.data.workspace}`, { username: content.data.joiningUser, level: 1 }, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async getNotification() {
        try {
            let { data } = await axios.get(`${this._base_url}/notif/${this._id}`, {
                headers: {
                    'Authorization': `Bearer ${this._access_token}`
                }
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Notification;