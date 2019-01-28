const express = require('express')
const router = express.Router()
//model data goes here
const User = require('../models/users')
const bcrypt = require('bcryptjs')
//install bcryptjs
//express-session - required in server .js

// router.get('/', (req, res) => {
//     res.render('users/show')
// })


//registration
router.post('/', async (req, res) => {
    //username
    const username = req.body.username
    const password = req.body.password
    const hashedPswrd = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    //enter into database
    const newUser = {};
    newUser.username = username
    newUser.email = req.body.email
    newUser.password = hashedPswrd
    //newUser.accountType = req.body.accountType === 'teacher' ? 'teacher' : 'student' //for mulptiple accounts//
    try {
        //User.create -- User is coming from const User = 
        const createdUser = await User.create(newUser)
        //create a session
        req.session.username = createdUser.username;
        req.session.logged = true;
        //req.session.accountype = createdUser.accountype //for multiple accounts//
        //redirect to specific index (ejs)
        res.redirect('/users')
    } catch (err) {
        res.send(err)
    }

})



//log-in
router.post('/login', async (req, res) => {
    try {
        //find logged in user //getting username from req.body (username was attached via form and kept in req.body)
        const loggedUser = await User.findOne({ username: req.body.username })

        //if user exists
        if (loggedUser) {
            //check if the passwords match, if they do, redirect to page, if not, keep on splash page with message
            //calling loggedUser's password from schema and comparing it to the form attached to req.body
            if (bcrypt.compareSync(req.body.password, loggedUser.password)) {
                //once find user
                //have to set session.message to empty string
                req.session.message = ""
                req.session.logged = true
                req.session.username = loggedUser.username
                res.redirect('/users')
            } else {
                req.session.message = "YOUR PASSWORD IS INCORRECT"
                res.redirect('/')
            }
        } else {
            req.session.message = "YOU DONT EXIST HERE"
            res.redirect('/')
        }
    } catch (err) {
        res.send(err)
    }
})


//log-out //authentication/logout
router.get('/logout', (req, res) => {
    //.destroy
    req.session.destroy( (err) => {
        if (err) {
            res.send(err)
        } else {
            res.redirect('/')
        }
    })
})


module.exports = router;