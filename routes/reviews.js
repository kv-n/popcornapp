const express = require('express')
const router = express.Router()
//model data goes here
const Review = require('../models/reviews')
const User = require('../models/users')
//api key and axios
// const axios = require('axios')
// const token = process.env.MOVIEDBAPI;

// const rootURL = 'https://api.themoviedb.org'

//ROUTES

//index
router.get('/', async (req, res) => {

    try {
        const allUsers = await User.find({});
        res.render('reviews/index', {
            users: allUsers
        })
    } catch (eerr) {
        res.send(err)
    }
    // User.find({}, (err, allUsers) => {
    //     res.render('reviews/index', {
    //         users: allUsers
    //     })
    // })
})

//new route//rendering create form
router.get('/new', (req, res) => {
    User.find({}, (err, allUsers) => {
        res.render('reviews/new', {
            users: allUsers
        })
    })

})


//create route //create in our database
router.post('/', (req, res) => {
 User.findById(req.body.userId, (err, foundUser) => {
        Review.create(req.body, (err, createdReview) => {
            if (err) {
                res.send(err)
            } else {
                foundUser.review.push(createdReview);
                foundUser.save((err, data) => {
                    res.redirect('/reviews')
                })
            }
        })
    })
})


//edit route//edit form
router.get('/:id/edit', (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        User.find({}, (err, allUsers) => {
            User.findOne({ 'review._id': req.params.id }, (err, reviewUser) => {
                if (err) {
                    res.send(err)
                } else {
                    res.render('reviews/edit', {
                        review: foundReview,
                        users: allUsers,
                        reviewUser: reviewUser
                    })
                }
            })
        })
    })
})

//update//edits into databse
router.put('/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedReview) => {
        User.findOne({ 'review._id': req.params.id }, (err, foundUser) => {
            if (foundUser._id.toString() !== req.body.userId) {
                foundUser.review.id(req.params.id).remove()
                foundUser.save((err, savedFoundUser) => {
                    User.findById(req.body.userId, (err, newUser) => {
                        newUser.review.push(updatedReview)
                        newUser.save((err, savedFoundUser) => {
                            res.redirect(`/reviews/${req.params.id}`)
                        })
                    })
                })
            } else {
                foundUser.review.id(req.params.id).remove()
                foundUser.review.push(updatedReview);
                foundUser.save((err, data) => {
                    res.redirect(`/reviews/${updatedReview._id}`)
                })
            }
        })
    })
});

//show
router.get('/:id', (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err) {
            res.send(err)
        } else {
            res.render('./reviews/show', {
                review: foundReview
            })
        }
    })
})

//delete
router.delete('/:id', (req, res) => {
    Review.findByIdAndRemove(req.params.id, (err, deletedReview) => {
        User.findOneAndRemove({ 'review._id': req.params.id }, (err, foundUser) => {
            foundUser.review.id(req.params.id).remove()
            foundUser.save((err, data) => {
                if (err) {
                    res.send(err)
                } else {
                    console.log(deletedReview)
                    res.redirect('/reviews')
                }
            })


        })
    })
})

module.exports = router