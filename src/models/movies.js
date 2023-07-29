const pool = require("../database/database.js");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const gcsBucketName = "bucket-nivekino";
const gcs = new Storage({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const createMovie = async (movie) => {
  if (
    !movie.name ||
    !movie.budget ||
    !movie.date ||
    !movie.duration ||
    !movie.imageUrl ||
    !movie.category
  ) {
    throw new Error(
      "Missing required fields. Please provide name, budget, date, duration, imageUrl and category."
    );
  }

  if (
    typeof movie.name !== "string" ||
    typeof movie.imageUrl !== "string" ||
    typeof movie.date !== "string" ||
    typeof movie.category !== "string"
  ) {
    throw new Error(
      'Invalid data type. "name", "imageUrl", "date" and category should be strings.'
    );
  }

  if (typeof movie.budget !== "number" || isNaN(movie.budget)) {
    throw new Error('Invalid data type. "budget" should be a number.');
  }

  if (
    typeof movie.duration !== "number" ||
    isNaN(movie.duration) ||
    movie.duration <= 0
  ) {
    throw new Error(
      'Invalid data type. "duration" should be a positive number.'
    );
  }

  try {
    const { name, budget, date, duration, imageUrl, category} = movie;
    const image = await uploadImageToGCS(imageUrl);

    const query =
      "INSERT INTO movie (name, budget, date, duration, img, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [name, budget, date, duration, image, category];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error creating the movie:", error);
    throw error;
  }
};

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
    const { name, budget, date, duration, imageUrl } = movieUpdates;

    if (!name || !budget || !date || !duration || !imageUrl) {
      throw new Error(
        "Missing required fields. Please provide name, budget, date, duration, and imageUrl."
      );
    }

    if (
      typeof name !== "string" ||
      typeof imageUrl !== "string" ||
      typeof date !== "string"
    ) {
      throw new Error(
        'Invalid data type. "name", "imageUrl", and "date" should be strings.'
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
      "UPDATE movie SET name = $1, budget = $2, date = $3, duration = $4, img = $5 WHERE id = $6 RETURNING *";
    const values = [name, budget, date, duration, image, movieId];

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
    if (typeof searchTerm !== "string" || searchTerm.trim() === "") {
      throw new Error(
        "Invalid search term. Please provide a non-empty string."
      );
    }

    const query = "SELECT * FROM movie WHERE lower(name) LIKE $1";
    const values = [`%${searchTerm.toLowerCase()}%`];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

const searchMoviesByCategory = async (searchTerm) => {
  try {
    if (typeof searchTerm !== "string" || searchTerm.trim() === "") {
      throw new Error("Invalid search term. Please provide a non-empty string.");
    }

    const query = "SELECT * FROM movie WHERE lower(category) LIKE $1";
    const values = [`%${searchTerm.toLowerCase()}%`];
    const { rows } = await pool.query(query, values);

    return rows;
  } catch (error) {
    console.error("Error searching movies by category:", error);
    throw error;
  }
};

async function uploadImageToGCS(imagePath) {
  try {
    const imageReadStream = fs.createReadStream(imagePath);
    const destinationFileName = `images/${Date.now()}_${imagePath
      .split("/")
      .pop()}`;

    const gcsFile = gcs.bucket(gcsBucketName).file(destinationFileName);
    const gcsStream = gcsFile.createWriteStream();

    imageReadStream.pipe(gcsStream);

    await new Promise((resolve, reject) => {
      gcsStream.on("error", (error) => {
        console.error("Error saving the image to GCS:", error);
        reject(error);
      });

      gcsStream.on("finish", () => {
        console.log("Image saved to GCS successfully");
        resolve();
      });
    });

    const imageUrl = `https://storage.googleapis.com/${gcsBucketName}/${destinationFileName}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  getMoviesByYear,
  searchMovies,
  searchMoviesByCategory,
};
