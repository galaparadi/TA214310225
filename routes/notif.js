const router = require('express').Router();
const UserDataSource = require('../datasource/datasource').Users();

router.get('/', (req, res) => res.send('notif'))
    .post('/', (req, res) => res.send('notif'))
    .get('/:user', async (req,res) => {
        let notifications = await UserDataSource.getNotifications({name: req.params.user});
        res.send({status: 1, notifications})
    })

module.exports = router;