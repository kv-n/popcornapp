const express = require('express');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('users/new', {
        message: req.session.message
    })
})

module.exports = router