const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/database');

// Load config and Database connection
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(
    `App listening at http://localhost:${port} and running mode is ${process.env.NODE_ENV}`
  )
);
