const pool = require("../database/database.js");

const getOptions = async () => {
  const query = "SELECT * FROM option";
  const { rows } = await pool.query(query);
  return rows;
};


module.exports = {
  getOptions,
};
