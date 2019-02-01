const express = require('express')
const router = express.Router()
const Review = require('../models/reviews')
const User = require('../models/users')

//ROUTES


//create route //create in our database
router.post('/:id/:movieId/:movieTitle', (req, res) => {
    //finding current user by ID
    //creating the review and saving it in req.body
 User.findById(req.params.id, (err, foundUser) => {
        Review.create(req.body, (err, createdReview) => {
            if (err) {
                res.send(err)
            } else {
                //created review matches the movieid with movieid in req.params
                //created review matches movie title with movie title in req.params
                createdReview.movieId = req.params.movieId
                createdReview.movieTitle = req.params.movieTitle
                createdReview.save()
                //pushing up created review up to the users reviews array
                foundUser.review.push(createdReview);
                foundUser.save((err, data) => {
                    res.redirect(`/movies/${req.params.movieId}`)
                })
            }
        })
    })
})

//edit route //edit form
router.get('/:id/edit', (req, res) => {
    Review.findById(req.params.id, (err, foundReview) => {
        if (err){
            res.send(err)
        } else {
            res.render('reviews/edit', {
                review: foundReview
            })
        }
    })
})

//update //edits into database
router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        const foundUser = await User.findById(req.session.userId)
        // foundUser.review === [] find where the old review is and delete and then add the updated review
        await foundUser.review.id(req.params.id).remove()
        foundUser.review.push(updatedReview)
        foundUser.save((err, data) => {
            res.redirect(`/reviews/${req.session.userId}`)
        })
    } catch (err) {
        res.send("this is the err" + err)
    }
});

//show
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.render('./reviews/show', {
            reviews: user.review,
        })
    })
})

// show review
router.get('/review/:id', (req, res) => {
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
    // finding the review document id
    User.findOne({ 'review._id' : req.params.id }, (err, foundUser) => {
        // finding the user and review id and matching it to the review in the params and removes it
        foundUser.review.id(req.params.id).remove()
        foundUser.save((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect(`/reviews/${foundUser._id}`)
            }
        })
    })
})

module.exports = router