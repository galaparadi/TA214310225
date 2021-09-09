function loadDropboxPicker() {
    options = {
        success: function (files) {
            console.log(files)
        },
        cancel: function () {

        },
    };
    Dropbox.choose(options);
}