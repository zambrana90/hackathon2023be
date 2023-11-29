require('dotenv').config();

const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');
const cors = require('./config/cors.config');

require('./config/db.config');

const app = express();

/* Middlewares */

app.use(express.json());
app.use(cors);
app.use(logger('dev'));

/* Routes */

const routes = require('./config/routes');
app.use('/', routes);

/* Handle Errors */

app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

app.use((error, req, res, next) => {
  if (error.message && error.message.includes('E11000'))
    error = createError(400, 'Already exists');
  else if (!error.status) error = createError(500, error);

  if (error.status >= 500) {
    console.error(error);
  }

  const data = {};
  data.message = error.message;
  data.errors = error.errors
    ? Object.keys(error.errors).reduce(
        (errors, key) => ({
          ...errors,
          [key]: error.errors[key].message || error.errors[key],
        }),
        {}
      )
    : undefined;

  res.status(error.status).json(data);
});

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(`Ready! Listen on port ${port}`);
});
