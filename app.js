var express = require('express');
var indexRouter = require('./routes/index');
var path = require('path');
var body_parser = require('body-parser');
var session = require('express-session');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;