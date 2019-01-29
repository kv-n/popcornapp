const express = require('express')
// const router = express.Router()
// api key and axios
const axios = require('axios')
const token = process.env.MOVIEAPI_TOKEN;

const rootUrl = 'https://api.themoviedb.org/'

console.log('here it is',token)



const topMovies = `${rootUrl}3/movie/top_rated?api_key=${token}`

console.log(topMovies)

const getLatestMovies = (req, res) =>
    axios.get(topMovies)
        .then(response => response.data.results)






module.exports = {
    getLatestMovies
}