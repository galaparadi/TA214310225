const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controller/workspace');
const HomeController = require('../controller/home');
const fileRouter = require('./file');

router.get('/', 
  WorkspaceController.isLogin,  
  WorkspaceController.setWorkspaceData, 
  WorkspaceController.setUser, 
  WorkspaceController.render
);

router.use('/file',fileRouter);

router.get('/chat', 
  WorkspaceController.isLogin,
  (req,res) => {
    console.log(req.path);
    console.log(req.params);
    res.render('chat', {ww: req.params.workspace, layout: false})
});

router.get('/:?*', 
  WorkspaceController.isLogin,
  WorkspaceController.setWorkspaceData, 
  WorkspaceController.setUser,
  WorkspaceController.render
);

module.exports = router;
