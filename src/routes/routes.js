const { Router } = require("express");
const router = Router();
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const multer = require("multer");
const pool = require("../database/database.js");

const bucketName = "bucket-nivekino";
const gcs = new Storage({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = gcs.bucket(bucketName);
const upload = multer();
const moviesController = require("../controllers/moviesController");
const optionsController = require("../controllers/optionsController");

// Rutas para películas
router.get("/api/movies", moviesController.getAllMovies);
router.get("/api/movies/:id", moviesController.getMovieById);
router.delete("/api/movies/:id", moviesController.deleteMovie);
router.get("/api/search", moviesController.searchMoviesController);
router.get("/api/search-category", moviesController.searchCategoryMovies);

router.put("/api/movies/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, budget, date, duration, category, description } = req.body;
    const imageFile = req.file;

    let image = null;
    if (imageFile) {
      image = await uploadImageToGCS(imageFile);
    }

    let query, values;

    if (image) {
      query =
        "UPDATE movie SET name = $1, budget = $2, date = $3, duration = $4, img = $5, category = $6, description = $7 WHERE id = $8 RETURNING *";
      values = [name, budget, date, duration, image, category, description, id];
    } else {
      query =
        "UPDATE movie SET name = $1, budget = $2, date = $3, duration = $4, category = $5, description = $6 WHERE id = $7 RETURNING *";
      values = [name, budget, date, duration, category, description, id];
    }

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error updating the movie:", error);
    res.status(500).json({ error: "Error updating the movie" });
  }
});

router.post("/api/movies", upload.single("image"), async (req, res) => {
  try {
    const { name, budget, date, duration, category, description } = req.body;
    const imageFile = req.file;
    console.log(req.body);

    const image = await uploadImageToGCS(imageFile);

    const query =
      "INSERT INTO movie (name, budget, date, duration, img, category, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [name, budget, date, duration, image, category, description];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating the movie:", error);
    res.status(500).json({ error: "Error creating the movie" });
  }
});

const uploadImageToGCS = async (imageFile) => {
  if (!imageFile) {
    return null;
  }

  const { originalname, buffer } = imageFile;
  const gcsFileName = `${Date.now()}-${originalname}`;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: imageFile.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (error) => reject(error));
    stream.on("finish", () =>
      resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`)
    );
    stream.end(buffer);
  });
};

// Rutas para opciones
router.get("/api/options", optionsController.getOptions);
router.put("/api/options/:id/disable", optionsController.updateOptionDisable);

module.exports = router;
