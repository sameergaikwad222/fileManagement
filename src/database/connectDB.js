const config = require("../configs/config.json");
const mongoose = require("mongoose");
const { logger } = require("../utils/logs");
async function connectDatabase() {
  try {
    await mongoose.connect(config.database.url, {
      dbName: "users",
    });
    logger.info("Connect to database successfully");
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

module.exports = { connectDatabase };
