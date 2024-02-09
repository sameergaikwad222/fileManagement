const express = require("express");
const userRouter = express.Router();
const {
  getFilteredUser,
  addMultipleUsers,
  updateMultipleUsers,
  deleteMultipleUsers,
  getSingleUser,
  updateSingleUser,
  authenticateUser,
  getNewToken,
  deAuthenticateUser,
} = require("../controllers/authController");

//Authorization and Authentication Block
userRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to User Route" });
});
userRouter.post("/login", authenticateUser);
userRouter.post("/token", getNewToken);
userRouter.post("/logout", deAuthenticateUser);

//Resource Blocks
userRouter.get("/users", getFilteredUser);
userRouter.get("/users/:id", getSingleUser);
userRouter.patch("/users/:id", updateSingleUser);
userRouter.post("/users", addMultipleUsers);
userRouter.patch("/users", updateMultipleUsers);
userRouter.delete("/users", deleteMultipleUsers);

module.exports = { userRouter };
