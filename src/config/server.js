const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();

// Settings
app.set('port', process.env.PORT || 1224);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

// Middelware
app.use(bodyParser.urlencoded({extended: false}));
app.use('/assets', express.static(path.join(__dirname, '../app/views/assets')));

module.exports = app;