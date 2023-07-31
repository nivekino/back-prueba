const { Pool } = require("pg");
const url = require("url");
const dotenv = require("dotenv");
dotenv.config();

let pool;

// Function to create the production pool based on the connection URL
const createProductionPool = () => {
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(":");
  const user = auth[0];
  const password = auth[1];
  const host = params.hostname;
  const {port} = params;
  const database = params.pathname.split("/")[1];

  return new Pool({
    user,
    host,
    database,
    password,
    port,
    ssl: { rejectUnauthorized: false }, // If you need to disable SSL certificate verification, add this line. Otherwise, remove it for a secure connection.
  });
};

// Function to create the local pool for development
const createLocalPool = () => {
  return new Pool({
    user: "postgres",
    host: "localhost",
    database: "movie-galery",
    password: process.env.PASSWORD,
    port: 5432,
  });
};

// Check if the environment is production or development and create the appropriate pool
if (process.env.NODE_ENV === "production") {
  pool = createProductionPool();
  console.log("Production pool created");
} else {
  // pool = createLocalPool();
  // console.log("Local pool created");
  pool = createProductionPool();
  console.log("Production pool created");
}

module.exports = pool;