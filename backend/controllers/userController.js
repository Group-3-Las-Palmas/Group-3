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
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: `Email already exists.` }); // 409 Conflict
    }

    // Hash the password
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
    // Ahora obtenemos el ID desde los parámetros de ruta
    const userId = req.params.id;

    const { username, password, ...extraFields } = req.body;

    // Verify fields
    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({
        message: "Incorrect fields.",
      });
    }

    // Verify empty fields
    if (username !== undefined && username.trim() === "") {
      return res.status(400).json({
        message: "The 'username' field cannot be empty.",
      });
    }

    if (password !== undefined && password === "") {
      return res.status(400).json({
        message: "The 'password' field cannot be empty.",
      });
    }

    // Check user
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only existing fields
    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (password !== undefined) updateFields.password = await bcrypt.hash(password, 10);
    console.log(`DEBUG: Hash generado: ${updateFields.password}`);
    const updatedUser = await existingUser.update(updateFields);

    res.status(200).json({
      id: updatedUser.user_id,
      username: updatedUser.username,
    });
  } catch (error) {
    console.error("Error updating user:", error);
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

    await User.destroy({ where: { user_id: id } });

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

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error getting user" });
  }
};
