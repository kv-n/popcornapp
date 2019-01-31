const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title: String,
    review: String,
    rating: String,
    movieTitle: String,
    movieId: Number
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review