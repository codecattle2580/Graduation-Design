var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var UserRouter = require('./routes/users/user')
var listRouter = require('./routes/users/list');
var Agritourism = require('./routes/agritourism');
var Food = require('./routes/food')
var Room = require('./routes/room')
var Order = require('./routes/order')
var Message = require('./routes/message')
var UpLoad = require('./routes/upload')

const bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
require('./models/associations')

//跨域问题解决方面
app.all('/api/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/', indexRouter);
app.use('/api', UserRouter)
app.use('/api/list', listRouter)
app.use('/api/agritourism', Agritourism)
app.use('/api/food', Food)
app.use('/api/room', Room)
app.use('/api/order', Order)
app.use('/api/message', Message)
app.use('/api/upload', UpLoad)
module.exports = app;
