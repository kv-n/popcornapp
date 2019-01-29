const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Review = require('../models/reviews')

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
            username: req.session.username
        })
    } catch (err) {
        res.send(err)
    }
})


//update form
router.get('/:id/edit', (req, res) => {
    User.findById(req.params.id, (err, editedUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(editedUser)
            res.render('users/edit', {
                user: editedUser
            })
        }
    })
})

//update
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, editedUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(editedUser)
            res.redirect('/users')
        }
    })
})



//delete get and route
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(foundUser)
            res.render('users/show', {
                user: foundUser
            })
        }
    })
})


router.delete('/:id', (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }, (err, deletedUser) => {
        const userIds = [];
        for (let i = 0; i < deletedUser.review.length; i++) {
            userIds.push(deletedUser.review[i]._id)
        }

        Review.deleteMany(
            {
                _id: { $in: userIds }
            },
            (err, data) => res.redirect('/users')
        )
    })
})



module.exports = router