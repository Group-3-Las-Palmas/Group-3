import models from "../models/index.js";
import bcrypt from "bcrypt";

const { User } = models;

//Get all user
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "username", "email"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Create new user
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Email, password and name are required." });
  }

  try {
    // Hash de password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Error to create user" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { username, email, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({
        message: "Only 'name' and 'email' can be updated.",
      });
    }

    if (username !== undefined && username.trim() === "") {
      return res.status(400).json({
        message: "The 'name' field cannot be empty.",
      });
    }

    if (email !== undefined && email.trim() === "") {
      return res.status(400).json({
        message: "The 'email' field cannot be empty.",
      });
    }

    // Get the existing user using the userId from the token
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;

    const updateUser = await existingUser.update(updateFields);

    res.status(200).json({
      id: updateUser.user_id,
      username: updateUser.username,
      email: updateUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user." });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.destroy({ where: { id } });

    res.status(200).json({ message: `User with ID ${id} correctly deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ["user_id", "username", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Error getting user" });
  }
};
