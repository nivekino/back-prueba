const Movies = require("../models/movies");

const createMovie = async (req, res) => {
  try {
    const movie = await Movies.createMovie(req.body);
    res.status(200).json({ data: movie, message: "Película creada" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la película" });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const year = req.query.year;

    let movies = await Movies.getAllMovies();

    if (year) {
      movies = movies.filter((movie) => movie.date.startsWith(year));
    }

    res.status(200).json({ data: movies, message: "Todas las películas" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las películas" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movies.getMovieById(movieId);

    res.status(200).json({ data: movie, message: "Película encontrada" });
  } catch (error) {
    res.status(404).json({ error: "Película no encontrada" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movies.deleteMovie(movieId);

    res.status(200).json({ data: movie, message: "Película eliminada" });
  } catch (error) {
    res.status(404).json({ error: "Película no encontrada" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieUpdates = req.body;

    const updatedMovie = await Movies.updateMovie(movieId, movieUpdates);

    res
      .status(200)
      .json({ data: updatedMovie, message: "Película actualizada" });
  } catch (error) {
    res.status(404).json({ error: "Película no encontrada" });
  }
};

const searchMoviesController = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
      return res.status(400).json({ error: "Please provide a search term." });
    }

    const searchResults = await Movies.searchMovies(searchTerm);
    res.status(200).json({ data: searchResults, message: "Search results" });
  } catch (error) {
    res.status(500).json({ error: "Error searching movies" });
  }
};

const searchCategoryMovies = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ error: "Please provide a category." });
    }

    const searchResults = await Movies.searchCategoryMovies(category);
    res.status(200).json({ data: searchResults, message: "Search results" });
  } catch (error) {
    res.status(500).json({ error: "Error searching movies" });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  searchMoviesController,
  searchCategoryMovies,
};
