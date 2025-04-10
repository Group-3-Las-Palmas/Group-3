// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js"; // Models ya incluye LoginHistory
import { UniqueConstraintError, Op } from "sequelize"; // <-- Importar Op

// Extraer modelos
const { User, LoginHistory } = models; // <-- Añadir LoginHistory aquí

// URL relativa a tu imagen predeterminada (sin cambios)
const DEFAULT_PROFILE_IMAGE_URL = "/uploads/without_image.webp";

// Función register (sin cambios)
export const register = async (req, res) => {
  // ... (código existente sin cambios)
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    const existingUserByEmail = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUserByEmail) {
      return res.status(409).json({ message: `Email already exists.` });
    }

    const existingUserByUsername = await User.findOne({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return res.status(409).json({ message: `Username already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profile_image_url: DEFAULT_PROFILE_IMAGE_URL,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        profile_image_url: newUser.profile_image_url,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    if (error instanceof UniqueConstraintError) {
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

// Función login (MODIFICADA)
export const login = async (req, res) => {
  const user = req.user;
  const payload = {
    user_id: user.user_id,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined.");
    return res.status(500).json({ message: "Internal server error." });
  }
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  try {
    // --- AÑADIR ESTO: Registrar el intento de login exitoso ---
    await LoginHistory.create({
        user_id: user.user_id,
        login_timestamp: new Date() // Sequelize usa el tiempo actual por defecto si no se especifica
    });
    console.log(`Login recorded for user ${user.user_id}`);
    // --- FIN DE LA MODIFICACIÓN ---

    // Respuesta de login exitoso (sin cambios)
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        profile_image_url: user.profile_image_url,
      },
    });
  } catch (error) {
      // Si falla el registro del login, aún queremos enviar la respuesta de login exitoso,
      // pero logueamos el error. Podrías manejar esto diferente si el registro es crítico.
      console.error(`Failed to record login for user ${user.user_id}:`, error);
      // Enviar la respuesta de login igualmente
       res.json({
        message: "Login successful (but history record failed)", // Mensaje opcional indicando el problema
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          profile_image_url: user.profile_image_url,
        },
      });
  }
};

// --- NUEVA FUNCIÓN: Obtener historial de login de los últimos 7 días ---
export const getLoginHistory = async (req, res) => {
    const userId = req.user.user_id; // ID del usuario autenticado (viene del middleware authenticateToken)

    if (!userId) {
        return res.status(401).json({ message: "User ID not found in token." });
    }

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Fecha de hace 7 días

        const history = await LoginHistory.findAll({
            where: {
                user_id: userId,
                login_timestamp: {
                    [Op.gte]: sevenDaysAgo // Operador 'greater than or equal to'
                }
            },
            attributes: ['login_timestamp'], // Solo necesitamos la fecha/hora
            order: [['login_timestamp', 'ASC']] // Opcional: ordenar
        });

        // Mapear a formato YYYY-MM-DD y obtener fechas únicas
        const uniqueDates = [...new Set(history.map(record =>
            record.login_timestamp.toISOString().split('T')[0] // Extrae solo la parte de la fecha
        ))];

        res.json(uniqueDates); // Devuelve un array de strings ["YYYY-MM-DD", ...]

    } catch (error) {
        console.error(`Error fetching login history for user ${userId}:`, error);
        res.status(500).json({ message: 'Error fetching login history', error: error.message });
    }
};
// --- FIN NUEVA FUNCIÓN ---