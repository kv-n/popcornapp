const mongoose = require('mongoose');
const Review = require('./reviews')


const userSchema = mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    email: {type: String, required: true},
    review: [Review.schema]
})

const User = mongoose.model('User', userSchema)

module.exports = User;