const { google } = require('googleapis');
const { google: keys } = require('../config/keys')

exports.hallo = () => {
    console.log('hallo')
}

exports.fileList = async (accessToken) => {
    const oAuth2Client = new google.auth.OAuth2(
        keys.clientID,
        keys.clientSecret,
        "http://localhost/u/auth/google/redirect");

    oAuth2Client.setCredentials({
        access_token: accessToken,
        // ---- this field is optional ----
        // refresh_token: "1//0gNWD0osXDQXrCgYIARAAGBASNwF-L9IrANYwG758VMCXLz-0Z9uGj0qAat_Y4Kh8yyVYKNZx3gzVLnCWXM9onmHuAuV9lYB8M0s",
        // expiry_date:1605632593449,
        // scope:"https://www.googleapis.com/auth/drive.file",
        // token_type:"Bearer"
    });

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        let newFiles = [];
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            newFiles = files.map((file) => {
                console.log(`${file.name} (${file.id})`);
                return `${file.name} (${file.id})`
            });
        } else {
            console.log('No files found.');
        }
        return newFiles;
    });
}