
var express = require('express');
var multer = require('multer');
var router = express.Router();
const axios = require('axios');
const passport = require('passport');
const FormData = require('form-data');
const WorkspaceDatasource = require('../datasource/datasource').Workspaces();

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get('/', (req, res) => {
	res.sendStatus(403);
});

// how to catch error when downloading
router.get('/download/:workspace/:name', async (req, res, next) => {
	try {
		let response = await axios({ url: `http://localhost:4000/workspaces/${req.params.workspace}/documents/${req.params.name}/file`, responseType: 'stream', method: "GET" });
		response.data.pipe(res).on('error', error => { throw new Error() });
	} catch (error) {
		console.log(error);
		next(error);
	}
})

router.post('/upload', upload.single('document'), async (req, res, next) => {
	let form = new FormData();
	form.append('workspace', req.body.workspace);
	form.append('filename', req.body['file-name']);
	form.append('author', req.user._id);
	form.append('file', req.file.buffer, req.body['file-name']);

	try {
		let data = (await WorkspaceDatasource.addDocument({ form, workspace: req.body.workspace })).data;
		res.redirect(`/${req.body.workspace}`);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = router;
