// Group-3/backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
import { UniqueConstraintError } from "sequelize";

const { User } = models;

// URL relativa a tu imagen predeterminada
const DEFAULT_PROFILE_IMAGE_URL = "../uploads/without_image.webp"; // ¡Asegúrate que este archivo exista!

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    // Verifica si el email ya existe
    const existingUserByEmail = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUserByEmail) {
      return res.status(409).json({ message: `Email already exists.` });
    }

    // Verifica si el nombre de usuario ya existe (si es único en tu modelo)
    const existingUserByUsername = await User.findOne({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return res.status(409).json({ message: `Username already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario incluyendo la URL de la imagen de perfil predeterminada
    const newUser = await User.create({
      username: username.trim(), // <-- Quitar espacios extra
      email: email.toLowerCase().trim(), // <-- Convertir a minúsculas y quitar espacios
      password: hashedPassword,
      profile_image_url: DEFAULT_PROFILE_IMAGE_URL, // <-- Asignar la imagen por defecto aquí
    });

    // Devolver también la URL de la imagen en la respuesta
    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        profile_image_url: newUser.profile_image_url, // <-- Incluir en la respuesta
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    // Manejo de errores de restricción única (email o username)
    if (error instanceof UniqueConstraintError) {
      // Determinar qué campo causó el error si es posible (puede requerir inspeccionar error.fields)
      const field = error.fields && Object.keys(error.fields)[0];
      const message = field
        ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
        : "Email or Username already exists.";
      return res.status(409).json({ message: message });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// La función login no necesita cambios para esto
export const login = async (req, res) => {
  const user = req.user;
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
      // Devolver toda la info relevante del usuario, incluida la imagen
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      profile_image_url: user.profile_image_url, // <-- Añadido aquí también
    },
  });
};
