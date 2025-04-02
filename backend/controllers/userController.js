import models from "../models/index.js";
import bcrypt from "bcrypt";

const { User } = models;

//Get all user
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Create new user
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Email, password and name are required." });
  }

  try {
    // Hash de password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error to create user" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { name, email, ...extraFields } = req.body;

    if (Object.keys(extraFields).lenght > 0) {
      return res.status(400).json({
        message: "Only 'name', 'email' and 'language' can be updated.",
      });
    }

    if (name !== undefined && name.trim() === "") {
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
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;

    const updateUser = await existingUser.update(updateFields);

    res.status(200).json(updateUser);
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
      attributes: ["user_id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);

  } catch (error) {
    res.status(500).json({ error: "Error getting user" });
  }
};
