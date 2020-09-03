const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('./database/database');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

// Handlebars Helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');

// Load config and Database connection
dotenv.config({ path: './config/config.env' });
connectDB();

// Passport config
require('./config/passport')(passport);

const app = express();
const port = process.env.PORT || 5000;

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Session middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global var (to access logged in user in edit)
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

app.listen(port, () =>
  console.log(
    `App listening at http://localhost:${port} and running mode is ${process.env.NODE_ENV}`
  )
);
