const config = require("../configs/config.json");
const mongoose = require("mongoose");
async function connectDatabase() {
  try {
    await mongoose.connect(config.database.url, {
      dbName: "users",
    });
    console.log("Connect to database successfully");
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

module.exports = { connectDatabase };
