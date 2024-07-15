const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB (without deprecated options)
mongoose.connect('mongodb://localhost:27017/blog');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});