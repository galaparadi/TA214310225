const express = require('express')
const router = express.Router();
const { fileList, downloadFile } = require('../lib/googledrive')

router.use((req, res, next) => {
    // console.log('ho');
    // next('router');
    next();
})

router.get('/', (req, res) => {
    console.log(req.cookies.setting);
    res.send(req.session);
});

router.get('/remove-cookies', (req, res) => {
    res.cookie('setting', '', { expires: Date })
    res.send('wo');
})

router.get('/filelist', (req, res) => {
    fileList(req.user)
        .then(response => res.send(response))
        .catch(err => next(err));
})

router.get('/download/:fileid', (req, res, next) => {
    let { accessToken, refreshToken } = req.user;
    let fileId = req.params.fileid
    downloadFile({ accessToken, refreshToken, fileId })
        .then(response => {
            res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            response.data.pipe(res);
        })
        .catch(err => next(err));
})

router.get('/show-session', (req, res) => {
    res.send(req.user);
})

module.exports = router;