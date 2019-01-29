const express = require('express')
const router = express.Router()
// api key and axios
const axios = require('axios')
const token = process.env.MOVIEAPI_TOKEN;

const rootUrl = 'https://api.themoviedb.org/3/'

console.log('here it is',token)




router.get('/:id', (req, res) => {
    console.log(`${rootUrl}movie/${req.params.id}?api_key=${token}`)
    axios.get(`${rootUrl}movie/${req.params.id}?api_key=${token}`)
        .then(response => {
            console.log(response)
            res.render('movies/show', {
                movie: response.data,
                user: {
                    name: req.session.username, 
                    id: req.session.userId
                }
            })
        }).catch(err => console.log(err))
})




module.exports = router