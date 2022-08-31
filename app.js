const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

//load config file
dotenv.config({path: './config/.env'});

// passport config
require('./config/passport')(passport)

connectDB();

const app = express();

// logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// sessions
app.use(session({
    secret: 'OVER 9000',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
  }))  

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'))
 
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`SCV ready! ${process.env.NODE_ENV} mode, port ${PORT}`);
})