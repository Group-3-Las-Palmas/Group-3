import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './db.js';

import usersRoutes from './routes/usersRoutes.js';
import postsRoutes from './routes/postsRoutes.js'; // Asume que has creado este archivo

import './models/index.js'; // Importar para que sync reconozca las asociaciones

dotenv.config();

const app = express();

app.use(cors()); // Habilita CORS si es necesario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base de la API
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('API woring!');
});

// Define el puerto
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables synced successfully.');
    // Inicia el servidor SOLO si la sincronización fue exitosa
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
    // Considera salir si la base de datos no se puede sincronizar
    // process.exit(1);
  });