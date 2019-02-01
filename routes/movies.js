const express = require('express')
const router = express.Router()
const axios = require('axios')
const token = process.env.MOVIEAPI_TOKEN;
const User = require('../models/users')

const rootUrl = 'https://api.themoviedb.org/3/'

const popularMovies = `${rootUrl}movie/popular?api_key=${token}&page=2`
const topMovies= `${rootUrl}movie/top_rated?api_key=${token}&page=2`


// show all popular movies
// route /movies
router.get('/', (req, res) => {
axios.get(popularMovies)
    .then(response => {
        res.render('movies/index', {
            //asking for a response for data of popularMovies from the API and then rendering it
            latestMovies: response.data.results
        })
    }).catch(err => console.log(err))
})

// show all top rated
// route /movies/toprated
router.get('/top-rated', (req, res) => {
axios.get(topMovies)
    .then(response => {
        res.render('movies/index', {
            //asking for a response for data of topMovies from the API and then rendering it
            latestMovies: response.data.results
        })
    }).catch(err => console.log(err))
})

// show one movie
// route /movies/:id
router.get('/:id', async (req, res) => {
    //user is finding the movie id
    const allUsersWithReview = await User.find({'review.movieId': req.params.id})
    //axios npm package that allows you to get api requests
    //axios is going into the API database and grabbing the move id and then rendering the movie show page
    axios.get(`${rootUrl}movie/${req.params.id}?api_key=${token}`)
        .then(response => {
        res.render('movies/show', {
            movie: response.data,
            allUsersWithReview,
            user: {
                name: req.session.username,
                id: req.session.userId,
            }
        })
    }).catch(err => console.log(err))
})



module.exports = router