let developerKey = 'AIzaSyAUnbZJLU_uR3J9oCA--_lCrMUAGC_UD74';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
let clientId = "1031394987005-jan8sh88i4poiv7o4kuhmlehdft8ou31.apps.googleusercontent.com"

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
let appId = "1031394987005";

// Scope to use to access user's Drive items.
let scope = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.readonly',
];

let pickerApiLoaded = false;
let oauthToken;

let objOfPicker = {}

const googleDrive = {

}

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
    gapi.load('auth', { 'callback': onAuthApiLoad });
    gapi.load('picker', { 'callback': onPickerApiLoad });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    // createPicker();
}

function handleAuthResult(authResult) {
    console.log(authResult)
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        document.querySelector('form>input[name="access-token"]').value = authResult.access_token;
        document.querySelector('input[name="refresh-token"]').value = authResult.refresh_token;
        createPicker();
    }
}

// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        let view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("application/vnd.google-apps.document,application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        let picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .enableFeature(google.picker.Feature.MINE_ONLY)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            // .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
        objOfPicker = { view, picker }
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        let fileId = data.docs[0].id;
        console.dir(data.docs)
        // alert('The user selected: ' + fileId);
        // document.getElementById('result').innerHTML = fileId;
        document.querySelector('form>input[name="drive-id"]').value = fileId;
        document.querySelector('input[name="filename"]').value = data.docs[0].name;
        document.querySelector('input[name="filename"]').focus();
        document.querySelector('input[name="mime-type"]').value = data.docs[0].mimeType;
        objOfPicker.picker.dispose()
    }
}