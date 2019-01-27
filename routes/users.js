const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Review = require('../models/reviews')

router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err) {
            res.send(err)
        } else {
            res.render("users/index", {
                users: allUsers
            })
        }
    })
})


router.get('/new', (req, res) => {
    res.render('users/new')
})

router.post('/', (req, res) => {
    User.create(req.body, (err, createdUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(`${createdUser} has been added to the database`)
            res.redirect('/users')
        }
    })
})

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
    User.findOneAndRemove(req.params.id, (err, deletedUser) => {
        const userIds = [];
        for (let i = 0; i < deletedUser.review.length; i++) {
            userIds.push(deletedUser.review[i]._id)
        }

        Review.deleteMany(
            {
                _id: { $in: userIds }
            },
            (err, data) => {
                res.redirect('/users')
            }
        )

    })
})



module.exports = router