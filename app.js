const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, DB_URL } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({
  origin: [
    'localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://127.0.0.1:3000',
    'https://127.0.0.1:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://movies666.nomoredomainsicu.ru',
    'https://api.movies666.nomoredomainsicu.ru',
    'http://movies666.nomoredomainsicu.ru',
    'http://api.movies666.nomoredomainsicu.ru',
    'http://praktikum.tk',
    'localhost:3000',
    'localhost:3001',
  ],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization', 'accept'],
  method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  maxAge: 30,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const connect = async () => {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
      useNewUrlParser: true,
    });
    await app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
};

connect();
