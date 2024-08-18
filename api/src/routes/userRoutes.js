import express from "express";
import {
  getUserById,
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Route to get a user by ID
router.get("/:id", getUserById);

// Route to get all users
router.get("/", getAllUsers);

// Route to create a new user
router.post("/", createUser);

// Route to update a user by ID
router.put("/:id", updateUserById);

// Route to delete a user by ID
router.delete("/:id", deleteUserById);

export default router;
