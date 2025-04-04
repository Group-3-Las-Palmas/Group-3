import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
import { UniqueConstraintError } from "sequelize";

const { User } = models;

// Registrar un nuevo usuario (adaptado)
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Email or Username already exists." });
    }
    res
      .status(500)
      .json({ message: "Error to register user", error: error.message });
  }
};

export const login = async (req, res) => {
  // req.user ya fue asignado por el middleware
  const user = req.user;

  // Generar el token usando la información del usuario
  const payload = {
    user_id: user.user_id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET no está definido.");
    return res.status(500).json({ message: "Error interno del servidor." });
  }

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  res.json({
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    },
  });
};
