const express = require('express')
const router = express.Router();

router.use((req, res, next) => {
    console.log('ho');
    next('router');
})

router.get('/', (req, res) => {
    res.send(req.session);
});

router.get('/wo',(req,res) => {
    res.send('wo');
})

module.exports = router;