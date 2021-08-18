const User = require('../models/user-model');
const Workspace = require('../models/workspace-model');
const dataSource = require('../datasource/datasource');
const HomeController = require('../controller/home');
const WorkspaceController = require('../controller/workspace');
const AjaxController = require('../controller/ajax')
var express = require('express');
var router = express.Router();
const reqAPI = require('../lib/requestAPI');
const { authorize } = require('passport');

// ====================================this block not valid==================================

// =======================================END of BLock=======================================
router.use((req, res, next) => req.user ? next() : res.status(401).send('not authorize'));

router.get("/user-list", async (req, res, next) => {
	// let users = await dataSource.Workspaces({}).getUsers();
	res.render('ajax/user-list', { layout: false })
})

router.get("/document-versions", async (req, res) => {
	try {
		let { documentId, workspaceName: name } = req.query;
		let versions = await dataSource.Workspaces({ name }).getDocumentVersions({ documentId })
		res.send({ documentId })
	} catch (error) {
		res.send({ status: 0, message: error.message })
	}
})

/**
 * body = { comment-input, document-id, workspace }
 */
router.post("/document-comments", async (req, res) => {
	try {
		let { comment, workspace, documentId } = req.body;
		let author = req.user.username;
		let commentObject = { comment, documentId, workspace, author };
		console.log(commentObject);
		// await dataSource.Workspaces().addComments(commentObject);
		res.send({ status: 1 });
	} catch (error) {
		debugger;
		res.send({ status: 0, message: error.message });
	}
});

router.get('/document-comments', async (req, res) => {
	try {
		let { workspace, id: documentId } = req.query;
		let { data } = await dataSource.Workspaces().getComments({ documentId });
		res.send(data);
	} catch (error) {
		console.log(error);
		res.send({ status: 0, message: error.message });
	}
})


router.post("/pull-chats", async (req, res, next) => {
	const { data: chats } = await dataSource.Workspaces().getChats({
		username: req.body.username,
		workspace: req.body.workspacename,
		receiver: req.body.receiver
	});
	res.send(chats);
})

router.post("/live-chat",
	async (req, res, next) => {
		let { users } = await dataSource.Workspaces().getUsers({ name: req.body.workspacename });
		users = users.filter(user => user.username !== req.body.username);
		res.render('ajax/livechat.hbs', { username: req.body.username, workspacename: String(req.body.workspacename), users, layout: false });
	})

router.post("/user-settings",
	HomeController.isLogin,
	async (req, res, next) => {
		res.render('ajax/user-settings.hbs', { layout: false });
	})

router.post("/document-details", AjaxController.documentDetail)
router.post("/file-dashboard", AjaxController.fileDashboard)

router.post("/new-document", function (req, res) {
	res.render("ajax/new-document-form", { workspacename: req.body.workspacename, layout: false });
});


router.post("/document-tree", function (req, res, next) {
	res.render("ajax/new-category", { workspacename: req.body.workspacename, layout: false })
})

router.post("/unlink", function (req, res) {
	let iduser = req.body.iduser;
	let idworkspace = req.body.idworkspace;
	Workspace.findById(idworkspace, function (err, workspace) {
		workspace.unlinkUser(iduser, function () {
			res.send("terunlink");
		})
	});
});

router.post("/update-workspace", function (req, res) {
	User.findById(req.body.iduser, function (err, user) {
		user.deleteWorkspaces(req.body.idworkspace, function () {
			res.send("terupdate")
		});
	})
});

router.get("/unsession", function (req, res) {
	req.session = null;
	res.send("session terhapus");
})

router.get("/ceksession", function (req, res) {
	res.send(req.session);
})

module.exports = router;