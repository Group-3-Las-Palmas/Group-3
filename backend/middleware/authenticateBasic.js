import bcrypt from "bcrypt";
import models from '../models/index.js';

const { User } = models;

// Helper para obtener detalles del error (opcional, pero útil)
const getErrorDetails = (error) => {
  if (error instanceof Error) {
    return error.message || "Unknown error";
  }
  return JSON.stringify(error, null, 2) || "Unknown error";
};

export const authenticateBasicCredentials = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // CORRECCIÓN: Si no hay encabezado Basic, es un error para el login
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Missing or invalid Basic Authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  let decodedCredentials;
  let email;
  let password;

  try {
      decodedCredentials = Buffer.from(base64Credentials, "base64").toString("utf8"); 
      [email, password] = decodedCredentials.split(":");
  } catch (e) {
      // Error al decodificar o hacer split
      return res.status(401).json({ message: "Invalid credential format" });
  }


  if (!email || !password) {
    // Doble verificación por si el split falló sin error
    return res.status(401).json({ message: "Incomplete credentials in Basic header" });
  }

  try {
    // Busca por email (asegúrate que tu modelo usa 'email')
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      // Mensaje genérico por seguridad
      return res.status(401).json({ message: "Invalid credentials user middleware" });
    }

    // Compara contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials password middleware" });
    }

    // ¡Éxito! Adjunta el usuario a req y continúa
    req.user = user; // Contiene el objeto User completo de Sequelize
    next();

  } catch (error) {
    console.error("Error in authenticateBasicCredentials:", getErrorDetails(error));
    res.status(500).json({
      message: "Internal error during authentication",
      error: getErrorDetails(error)
    });
  }
};