/* eslint-disable no-useless-escape */
const moviesRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../utils/validation');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate(validateMovie), createMovie);

moviesRouter.delete('/movies/:movieId', celebrate(validateMovieId), deleteMovie);

module.exports = moviesRouter;
