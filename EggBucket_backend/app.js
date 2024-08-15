var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors"); // Import the cors middleware
const dotenv=require('dotenv')

dotenv.config({path:'./config.env'})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var outletpartnerRouter=require('./routes/outlet_partner')
var deliverypartnerRoute=require('./routes/delivery_driver')
var customerRouter=require('./routes/customer')
var vendorRouter=require('./routes/vendor')
var orderRouter=require('./routes/order')
var adminRouter=require('./routes/admin')
var authRouter=require('./routes/auth')
var paymentRouter=require('./routes/payments')

require("./models/db");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/outletPartners',outletpartnerRouter)
app.use('/deliveryDrivers', deliverypartnerRoute);
app.use('/customers',customerRouter)
app.use('/vendors',vendorRouter)
app.use('/orders',orderRouter)
app.use('/admin',adminRouter)
app.use('/auth',authRouter)
app.use('/payment',paymentRouter)

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

module.exports = app;
