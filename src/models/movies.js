const pool = require("../database/database.js");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const multer = require("multer");

const getAllMovies = async () => {
  try {
    const query = "SELECT * FROM movie";
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error retrieving movies:", error);
    throw error;
  }
};

const getMovieById = async (movieId) => {
  try {
    const query = "SELECT * FROM movie WHERE id = $1";
    const values = [movieId];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }

    return rows[0];
  } catch (error) {
    console.error(`Error retrieving movie with ID ${movieId}:`, error);
    throw error;
  }
};

const deleteMovie = async (movieId) => {
  try {
    const query = "DELETE FROM movie WHERE id = $1";
    const values = [movieId];
    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }

    return {
      success: true,
      message: `Movie with ID ${movieId} deleted successfully.`,
    };
  } catch (error) {
    console.error(`Error deleting movie with ID ${movieId}:`, error);
    throw error;
  }
};

const updateMovie = async (movieId, movieUpdates) => {
  try {
    const { name, budget, date, duration, imageUrl, category, description } =
      movieUpdates;

    if (
      !name ||
      !budget ||
      !date ||
      !duration ||
      !imageUrl ||
      !category ||
      !description
    ) {
      throw new Error(
        "Missing required fields. Please provide name, budget, date, duration, imageUrl, category and description."
      );
    }

    if (
      typeof name !== "string" ||
      typeof imageUrl !== "string" ||
      typeof date !== "string" ||
      typeof category !== "string" ||
      typeof description !== "string"
    ) {
      throw new Error(
        'Invalid data type. "name", "imageUrl", category, description and "date" should be strings.'
      );
    }

    if (typeof budget !== "number" || isNaN(budget)) {
      throw new Error('Invalid data type. "budget" should be a number.');
    }

    if (typeof duration !== "number" || isNaN(duration) || duration <= 0) {
      throw new Error(
        'Invalid data type. "duration" should be a positive number.'
      );
    }

    const image = await uploadImageToGCS(imageUrl);

    const query =
      "UPDATE movie SET name = $1, budget = $2, date = $3, duration = $4, img = $5, category = $6, description = $7 WHERE id = $8 RETURNING *";
    const values = [
      name,
      budget,
      date,
      duration,
      image,
      category,
      description,
      movieId,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }

    return rows[0];
  } catch (error) {
    console.error(`Error updating movie with ID ${movieId}:`, error);
    throw error;
  }
};

const getMoviesByYear = async (year) => {
  try {
    if (typeof year !== "number" || isNaN(year) || year <= 0) {
      throw new Error("Invalid year. Please provide a valid positive number.");
    }

    const query = "SELECT * FROM movie WHERE EXTRACT(YEAR FROM date) = $1";
    const values = [year];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error) {
    console.error("Error retrieving movies by year:", error);
    throw error;
  }
};

const searchMovies = async (searchTerm) => {
  try {
    if (typeof searchTerm !== "string") {
      throw new Error(
        "Invalid search term. Please provide a non-empty string."
      );
    }

    const query = "SELECT * FROM movie WHERE lower(name) LIKE $1";
    const values = [`%${searchTerm.toLowerCase()}%`];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      const allMoviesQuery = "SELECT * FROM movie";
      const allMoviesResult = await pool.query(allMoviesQuery);
      return allMoviesResult.rows;
    }

    return rows;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

const searchMoviesByCategory = async (searchTerm) => {
  try {
    if (typeof searchTerm !== "string") {
      throw new Error(
        "Invalid search term. Please provide a non-empty string."
      );
    }

    const query = "SELECT * FROM movie WHERE lower(category) LIKE $1";
    const values = [`%${searchTerm.toLowerCase()}%`];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      const allMoviesQuery = "SELECT * FROM movie";
      const allMoviesResult = await pool.query(allMoviesQuery);
      return allMoviesResult.rows;
    }

    return rows;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  getMoviesByYear,
  searchMovies,
  searchMoviesByCategory,
};
