const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./database/database');

// Load config and Database connection
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));

app.listen(port, () =>
  console.log(
    `App listening at http://localhost:${port} and running mode is ${process.env.NODE_ENV}`
  )
);
