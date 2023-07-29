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
    !movie.imageUrl
  ) {
    throw new Error(
      "Missing required fields. Please provide name, budget, date, duration, and imageUrl."
    );
  }

  if (
    typeof movie.name !== "string" ||
    typeof movie.imageUrl !== "string" ||
    typeof movie.date !== "string"
  ) {
    throw new Error(
      'Invalid data type. "name", "imageUrl" and "date" should be strings.'
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
    const { name, budget, date, duration, imageUrl } = movie;
    const image = await uploadImageToGCS(imageUrl);

    const query =
      "INSERT INTO movie (name, budget, date, duration, img) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [name, budget, date, duration, image];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error creating the movie:", error);
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
};
