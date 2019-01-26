const mongoose = require('mongoose')
const connectionString = 'mongodb://localhost/popcorn'

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${connectionString}`)
})

mongoose.connection.on('err', (err) => {
    console.log(`Mongoose ${err}`)
})

mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose disconnected from ${connectionString}`)
})