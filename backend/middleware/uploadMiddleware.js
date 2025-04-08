// Group-3/backend/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = './uploads/';

// Asegurarse de que el directorio de subida existe
if (!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para aceptar solo imágenes (puedes ajustarlo)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Not an image! Please upload only images.'), false); // Rechazar archivo
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Límite de 5MB (ajusta según necesites)
  },
  fileFilter: fileFilter
});

// Exportamos el middleware configurado para un solo archivo llamado 'profileImage'
// 'profileImage' debe coincidir con el nombre del campo <input type="file" name="profileImage"> en tu formulario frontend
export const uploadProfileImage = upload.single('profileImage');