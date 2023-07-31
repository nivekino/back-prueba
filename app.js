const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const multer = require('multer');

const app = express();
const port = 3010;

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use(express.json());

app.use(require("./src/routes/routes.js"));

app.listen(port, () => {
  console.log(`API iniciada en http://localhost:${port}`);
});
