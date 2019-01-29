
var createError = require('http-errors');
var express = require('express');
require('./db/db')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
// require('dotenv').config();

var authRouter = require('./routes/authentication')

var reviewsRouter = require('./routes/reviews');
var usersRouter = require('./routes/users');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

app.use(session({
  secret: "This is a random string secret",
  resave: false,
  saveUninitialized: false
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

//setting the local variable for the views and point to req.session
app.use((req, res, next)=> {
  res.locals.thatUser = req.session.user
  next()
})

app.get('/', (req, res) => {
  res.render('index', {
    message: req.session.message
  })
})


app.use('/authentication', authRouter);

// app.use((req, res, next) => req.session.logged ? next() : res.redirect('/'));

app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });



app.listen(3000, () => {
  console.log('listening on port 3000')
})

module.exports = app;
