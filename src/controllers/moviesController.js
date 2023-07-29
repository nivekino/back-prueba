const Movies = require("../models/movies");

const createMovie = async (req, res) => {
  try {
    const movie = await Movies.createMovie(req.body);
    res.status(200).json({ data: movie, message: "Película creada" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la película" });
  }
};

module.exports = {
  createMovie,
};
