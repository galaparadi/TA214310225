const User = require('../models/user-model');
const Workspace = require('../models/workspace-model');
const dataSource = require('../datasource/datasource');
const HomeController = require('../controller/home');
const WorkspaceController = require('../controller/workspace');
var express = require('express');
var router = express.Router();
const reqAPI = require('../lib/requestAPI');

// ====================================this block not valid==================================

// =======================================END of BLock=======================================
router.post("/live-chat",
	(req, res, next) => {
		console.log(res.locals);
		const {users} = dataSource.Workspaces().getUsers({name: req.body.workspacename});
		res.render('ajax/livechat.hbs', { username: req.body.username, workspacename: String(req.body.workspacename), users, layout: false });
	})

router.post("/user-settings",
	HomeController.isLogin,
	async (req, res, next) => {
		res.render('ajax/user-settings.hbs', { layout: false });
	})

router.post("/document-details", async function (req, res, next) {
	try {
		let data = (await dataSource
			.Workspaces()
			.getDocument({
				name: req.body.workspacename,
				id: req.body.id
			}))
			.data;
		console.log(data);
		let workspace = req.body.workspacename
		res.render("ajax/document-detail", { name: workspace, document: data, layout: false })
		return true;
	} catch (err) {
		next(err);
		console.log(err);
		return false;
	}
})

router.post("/new-document", function (req, res) {
	res.render("ajax/new-document-form", { workspacename: req.body.workspacename, layout: false });
});

router.post("/file-dashboard", async function (req, res, next) {
	try {
		let documents = (await dataSource.Workspaces().getDocuments({ name: req.body.workspacename })).data;
		res.render("ajax/file-dashboard", { documents, layout: false })
		return true;
	} catch (err) {
		console.log(err);
		res.send("error sending data")
		return false;
	}
})

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