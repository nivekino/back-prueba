const Options = require("../models/options");

const getOptions = async (req, res) => {
  try {
    const options = await Options.getOptions();
    res.status(200).json({ data: options, message: "Menu results" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las opciones" });
  }
};

const updateOptionDisable = async (req, res) => {
  const { id } = req.params;
  const { disable } = req.body;

  if (typeof disable !== "boolean") {
    return res
      .status(400)
      .json({ error: "Invalid value for 'disable'. Must be a boolean." });
  }

  try {
    const option = await Options.getOptionById(id);

    if (!option) {
      return res.status(404).json({ error: "Option not found." });
    }

    await Options.updateOptionDisable(id, disable);

    res
      .status(200)
      .json({ message: "Option disable property updated successfully." });
  } catch (error) {
    console.error("Error updating option:", error);
    res
      .status(500)
      .json({ error: "Failed to update option disable property." });
  }
};

module.exports = {
  getOptions,
  updateOptionDisable,
};
