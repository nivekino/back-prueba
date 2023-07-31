const pool = require("../database/database.js");

const getOptions = async () => {
  const query = "SELECT * FROM option";
  const { rows } = await pool.query(query);
  return rows;
};

const getOptionById = async (id) => {
  const query = "SELECT * FROM option WHERE id = $1";
  const values = [id];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0]; // Return the first row since the ID should be unique
  } catch (error) {
    console.error("Error fetching option by ID:", error);
    throw error;
  }
};

const updateOptionDisable = async (id, disable) => {
  const query = "UPDATE option SET disable = $1 WHERE id = $2";
  const values = [disable, id];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating option disable:", error);
    throw error;
  }
};

module.exports = {
  getOptions,
  getOptionById,
  updateOptionDisable,
};
