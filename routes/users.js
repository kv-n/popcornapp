var express = require('express');
var router = express.Router();
//model data
const User = require('../models/users')

//index
router.get('/', (req, res) => {
  User.find({}, (err, allUsers) => {
    if (err) {
      res.send(err)
    } else {
      res.render('index', {
        users: allUsers
      })
    }
  })
})

//new//render create form
router.get('/new', (req, res) => {
  res.render('./users/new')
})

//create//create in our database//posting data
//change to registration route
router.post('/', (req, res) => {
  User.create(req.body, (err, createdUser) => {
    if (err) {
      res.send(err)
    } else {
      console.log(`${createdUser} has been added to the database`)
      res.redirect('/users/index')
    }
  })
})

//edit//show edit form to edit
router.get('/:id/edit', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render('users/edit', {
      user: foundUser
    })
  })
})


//update//puts edits into database
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, editedUser) => {
    if (err) {
      res.send(err)
    } else {
      console.log(editedUser)
      res.redirect('users')
    }
  })
})

//show page for index
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUsers) => {
    if (err) {
      res.send(err)
    } else {
      res.render('useres/show', {
        user: foundUser
      })
    }
  })
})

//show


//delete
router.delete('/:id', (req, res) => {
  User.findOneAndRemove(req.params.id, () => {
    res.redirect('/users')
  })
})


////////////////////////////////








module.exports = router;
