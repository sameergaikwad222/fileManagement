const express = require("express");
const config = require("./src/configs/config.json");
const app = express();
const PORT = config?.port || 3000;
const { fileRouter, userRouter } = require("./src/routes");
const { routeLogger } = require("./src/middlewares/routeLogger");
const { connectDatabase } = require("./src/database/connectDB");

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routeLogger);

//Routes
app.use("/api/file", fileRouter);
app.use("/api/auth", userRouter);

async function initApp() {
  try {
    await connectDatabase();
    app.listen(PORT, () =>
      console.log(`App is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log("Error while starting an application", error.message);
  }
}

initApp();
