import prisma from "../models/client.js";

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
};

// Update an existing user by ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    if (!name && !address && !phone) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, address, phone },
    });
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { auth0Id, email, name, address, phone } = req.body;

    if (!auth0Id || !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: auth0Id or email." });
    }

    const newUser = await prisma.user.upsert({
      where: { auth0Id },
      update: {
        email,
        name: name || null,
        address: address || null,
        phone: phone || null,
      },
      create: {
        auth0Id,
        email,
        name: name || null,
        address: address || null,
        phone: phone || null,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

// Delete a user by ID
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};
