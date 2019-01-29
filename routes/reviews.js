const express = require('express')
const router = express.Router()
//model data goes here
const Review = require('../models/reviews')
const User = require('../models/users')
const Movie = require('./movies')


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
        console.log(req.session.userId)
        res.render('reviews/new', {
            user: {
                name: req.session.username, 
                id: req.session.userId
            }
        })
    })

})


//create route //create in our database
router.post('/:id/:movieId', (req, res) => {
 User.findById(req.params.id, (err, foundUser) => {
        Review.create(req.body, (err, createdReview) => {
            if (err) {
                res.send(err)
            } else {
                createdReview.movieId = req.params.movieId
                createdReview.save()
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
            console.log('false', updatedReview)
            foundUser.review.id(req.params.id).remove()
            foundUser.review.push(updatedReview);
            foundUser.save((err, data) => {
                res.redirect(`/reviews/showreview/${updatedReview._id}`)
            })
        })
    })
});

//show
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        console.log(user.review)
        res.render('./reviews/show', {
            reviews: user.review
        })
    })
    // Review.findById(req.params.id, (err, foundReview) => {
    //     if (err) {
    //         res.send(err)
    //     } else {
    //         res.render('./reviews/showreview', {
    //             review: foundReview
    //         })
    //     }
    // })
})

// show review
router.get('/showreview/:id', (req, res) => {
    // User.findById(req.params.id, (err, user) => {
    //     console.log(user.review)
    //     res.render('./reviews/show', {
    //         reviews: user.review
    //     })
    // })
    Review.findById(req.params.id, (err, foundReview) => {
        console.log(foundReview)
        if (err) {
            res.send(err)
        } else {
            res.render('./reviews/showreview', {
                review: foundReview
            })
        }
    })
})

//delete
router.delete('/:id', (req, res) => {
    // Review.findByIdAndRemove(req.params.id, (err, deletedReview) => {
        User.findOne({ 'review._id': req.params.id }, (err, foundUser) => {
            console.log(foundUser)
            foundUser.review.id(req.params.id).remove()
            foundUser.save((err, data) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect('/reviews')
                }
            })
        })
    // })
})

module.exports = router