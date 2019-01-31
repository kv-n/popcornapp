const express = require('express');
const router = express.Router();
const User = require('../models/users')


router.get('/new', (req, res) => {
    res.render('users/new', {
        message: req.session.message
    })
})


router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.render("users/index", {
            users: allUsers,
            username: req.session.username,
        })
    } catch (err) {
        res.send(err)
    }
})

module.exports = router