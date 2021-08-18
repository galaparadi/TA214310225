var express = require('express');
var router = express.Router();
const WorkspaceController = require('../controller/workspace');

router.get('/register', WorkspaceController.renderRegisterPage);

router.post('/doregister', WorkspaceController.addWorkspace);

router.get('/invitation', (req, res) => { // menangani permintaan join workspace melalui undangan
});

router.post('/join', (req,res) => {
    
    res.redirect('/')
})

module.exports = router;
