const router = require('express').Router();
const UserDataSource = require('../datasource/datasource').Users();

router.get('/', (req, res) => res.send('feed'))
    .post('/', (req, res) => res.send('feed'))
    .get('/:user', async (req,res) => {
        let notifications = await UserDataSource.getFeeds({name: req.params.user});
        res.send({status: 1, notifications})
    })

module.exports = router;