const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    title: String,
    helpful: String,
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review