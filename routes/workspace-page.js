const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controller/workspace');
const HomeController = require('../controller/home');
const fileRouter = require('./file');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.use(WorkspaceController.isLogin)

router.get('/',
  WorkspaceController.setWorkspaceData,
  WorkspaceController.setUser,
  WorkspaceController.render
);

router.use('/file', fileRouter);

router.get('/chat',
  (req, res) => {
    console.log(req.path);
    console.log(req.params);
    res.render('chat', { ww: req.params.workspace, layout: false })
  });

router.post('/join',WorkspaceController.joinWorkspace)
router.post('/doc/:docid/version', upload.single('document'), WorkspaceController.addDocumentVersion)
router.post('/doc/:docid/comment', WorkspaceController.addComment)

module.exports = router;
