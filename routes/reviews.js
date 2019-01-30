const express = require('express')
const router = express.Router()
const Review = require('../models/reviews')
const User = require('../models/users')


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
})

//new route//rendering create form
router.get('/new', (req, res) => {
    User.find({}, (err, allUsers) => {
        res.render('reviews/new', {
            user: {
                name: req.session.username, 
                id: req.session.userId
            }
        })
    })

})


//create route //create in our database
router.post('/:id/:movieId/:movieTitle', (req, res) => {
    //finding current user by ID
    //creating the review and saving it in req.body
 User.findById(req.params.id, (err, foundUser) => {
        Review.create(req.body, (err, createdReview) => {
            if (err) {
                res.send(err)
            } else {
                //created review matches the movie Id
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


//edit route//edit form
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
        console.log(foundReview)
        if (err) {
            res.send(err)
        } else {
            res.render('./reviews/show', {
                review: foundReview
            })
        }
    })
})

//update//edits into database
router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        const foundUser = await User.findById(req.session.user.id)
        // foundUser.review === [] find where the old review is and delete and then add the updated review
        foundUser.review.id(req.params.id).remove()
        foundUser.review.push(updatedReview)
        foundUser.save((err, data) => {
            res.redirect(`/reviews/${req.session.userId}`)
        })
    }catch (err){
        res.send(err)
    }
});


//delete
router.delete('/:id', (req, res) => {
    //finding the review document id
    User.findOne({ 'review._id': req.params.id }, (err, foundUser) => {
        //
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