var express = require('express');
var router = express.Router();
const UserDatasource = require('../datasource/datasource').Users();

router.get('/registergoogle', (req,res) => {
	res.render('profile/register-google');
})

router.get('/:username', async function(req,res,next){
	try {
		res.locals.data = {};
		let user = (await UserDatasource.getUser({username: req.params.username})).user;
		let workspaces = (await UserDatasource.getWorkspaces({username: req.params.username})).workspaces;
		res.locals.data.user = user;
		res.locals.data.user.workspaces = workspaces;
		res.render('profile/profile', {title : res.locals.data.user.username + "'s profile"});
	} catch (error) {
		next(error);
	}
});

module.exports = router;