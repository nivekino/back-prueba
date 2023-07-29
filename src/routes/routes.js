const { Router } = require("express");
const router = Router();

const moviesController = require("../controllers/moviesController");
const optionsController = require("../controllers/optionsController");

// Rutas para películas
router.post("/api/movies", moviesController.createMovie);
router.get("/api/movies", moviesController.getAllMovies);
router.get("/api/movies/:id", moviesController.getMovieById);
router.delete("/api/movies/:id", moviesController.deleteMovie);
router.put("/api/movies/:id", moviesController.updateMovie);
router.get("/api/search", moviesController.searchMoviesController);

// Rutas para opciones
router.get("/api/options", optionsController.getOptions);

module.exports = router;
