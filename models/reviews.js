const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title: String,
    review: String,
    rating: Number,
    helpful: String,
    movieTitle: String,
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review