import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './db.js';

import usersRoutes from './routes/usersRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import exercisesRoutes from './routes/exercisesRoutes.js';
import rewardsRoutes from './routes/rewardsRoutes.js';
import userExercisesRoutes from './routes/userExercisesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

import './models/index.js'; // Import relations

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors()); // Enabled CORS if it is necessary
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/user-exercises', userExercisesRoutes);

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