var express = require('express');
var indexRouter = require('./routes/index');
var path = require('path');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;