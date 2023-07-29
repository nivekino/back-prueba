const { Router } = require("express");
const router = Router();

const moviesController = require("../controllers/moviesController");
const optionsController = require("../controllers/optionsController");

// Rutas para películas
router.post("/api/movies", moviesController.createMovie);

// Rutas para opciones
router.get("/api/options", optionsController.getOptions);

module.exports = router;
