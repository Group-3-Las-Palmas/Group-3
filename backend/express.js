import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './db.js';

import usersRoutes from './routes/usersRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import exercisesRoutes from './routes/exercisesRoutes.js';

import './models/index.js'; // Import relations

dotenv.config();

const app = express();

app.use(cors()); // Enabled CORS if it is necessary
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/exercises', exercisesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API working!');
});

// Port
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables synced successfully.');
    // Run server if the connection was succesfull
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
    // Considera salir si la base de datos no se puede sincronizar
    // process.exit(1);
  });