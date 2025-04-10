import models from "../models/index.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PROFILE_IMAGE_URL = "/uploads/without_image.webp";

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
    const userId = req.params.id;
    // Añade profile_image_url aquí
    const { username, password, profile_image_url } = req.body;
    const file = req.file; // Accede al archivo subido por multer

    console.log("Update request for user:", userId);
    console.log("Body:", req.body);
    console.log("File:", file);

    const user = await User.findByPk(userId);
    if (!user) {
      // Borra el archivo si se subió pero el usuario no existe
      if (file) await fs.unlink(file.path).catch(e => console.error("Error deleting orphaned file:", e));
      return res.status(404).json({ message: "User not found" });
    }

    // Validaciones (igual que antes)
    if (username !== undefined && username.trim() === "") {
       if (file) await fs.unlink(file.path).catch(e => console.error("Error deleting file on validation fail:", e));
      return res.status(400).json({ message: "Username cannot be empty." });
    }
    if (password !== undefined && password === "") {
       if (file) await fs.unlink(file.path).catch(e => console.error("Error deleting file on validation fail:", e));
      return res.status(400).json({ message: "Password cannot be empty if provided." });
    }

    const updateFields = {};
    const oldImagePath = user.profile_image_url; // Guardar ruta antigua

    if (username !== undefined) updateFields.username = username.trim();
    if (password !== undefined && password !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    // --- LÓGICA MODIFICADA PARA LA IMAGEN ---
    if (file) {
      // Caso 1: Se subió una nueva imagen
      updateFields.profile_image_url = `/uploads/${file.filename}`;
      console.log("Setting new profile image URL:", updateFields.profile_image_url);
    } else if (profile_image_url === null) {
      // Caso 2: Se envió explícitamente null -> resetear a default
      // Solo resetea si la imagen actual NO es ya la por defecto
      if (oldImagePath !== DEFAULT_PROFILE_IMAGE_URL) {
         updateFields.profile_image_url = DEFAULT_PROFILE_IMAGE_URL;
         console.log("Resetting profile image URL to default.");
      } else {
         console.log("Image is already default, no reset needed.");
      }
    }
    // --- FIN LÓGICA MODIFICADA ---

    // Actualizar solo si hay campos para ello
    if (Object.keys(updateFields).length > 0) {
        await user.update(updateFields);
        await user.reload(); // Recargar para obtener los datos actualizados
        console.log("User updated successfully in DB.");

        // Borrar imagen antigua SI SE ACTUALIZÓ la URL y la antigua NO ERA la default
        if (updateFields.profile_image_url && oldImagePath && oldImagePath !== DEFAULT_PROFILE_IMAGE_URL) {
            try {
                // Construye la ruta completa al archivo antiguo
                const fullOldPath = path.join(__dirname, '..', oldImagePath); // Asume que 'uploads' está un nivel arriba del directorio actual (__dirname)
                await fs.unlink(fullOldPath);
                console.log("Old profile image deleted:", oldImagePath);
            } catch (unlinkError) {
                 // Ignora si el archivo no existe, loguea otros errores
                 if (unlinkError.code !== 'ENOENT') {
                     console.error("Error deleting old profile image:", unlinkError);
                 } else {
                     console.log("Old profile image did not exist:", oldImagePath);
                 }
                // No fallar la request principal por esto
            }
        }

    } else {
      console.log("No fields provided or recognized to update.");
      // Si se subió un archivo pero no hubo otros cambios válidos, es un error
      if (file) {
         await fs.unlink(file.path).catch(e => console.error("Error deleting unused uploaded file:", e));
         return res.status(400).json({ message: "Image uploaded but no other valid fields to update." });
      }
    }

    // Devolver usuario actualizado (incluye la URL final de la imagen)
    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      profile_image_url: user.profile_image_url, // Devuelve la URL actualizada
    });

  } catch (error) {
     // Limpieza de archivo en caso de error general
     if (req.file) {
       try { await fs.unlink(req.file.path); } catch (e) { console.error("Error deleting uploaded file on general error:", e); }
     }

    // Manejo de errores (SequelizeUniqueConstraintError y otros)
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.fields && Object.keys(error.fields)[0];
      if (field === "username") {
        return res.status(409).json({ message: `Username '${req.body.username}' already exists.` });
      }
      // Añadir manejo para otros campos únicos si es necesario
    }
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

// Group-3/backend/controllers/userController.js

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ["user_id", "username", "email", "profile_image_url"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ error: "Error getting user" });
  }
};
