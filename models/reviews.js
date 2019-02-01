const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title: String,
    review: String,
    rating: String,
    // tie unique movie title to api movie 
    movieTitle: String,
    // tie unique movie id to api movie
    movieId: Number
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review