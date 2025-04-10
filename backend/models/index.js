// backend/models/index.js
import sequelize from "../db.js";

// Import all model definition files
import User from './users.js';
import Post from './posts.js';
import Comment from './comments.js';
import Exercise from './exercises.js';
import UserExercise from './userExercises.js';
import Reward from './rewards.js';
import LoginHistory from './loginHistory.js';

// User associations
User.hasMany(Post, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
User.hasMany(UserExercise, { foreignKey: 'user_id' });
User.hasMany(LoginHistory, { foreignKey: 'user_id' });

// Post associations
Post.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });

// Comment associations
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// Exercise associations
Exercise.hasMany(UserExercise, { foreignKey: 'exercise_id' });
Exercise.hasOne(Reward, { foreignKey: 'exercise_id' });

// UserExercise associations (Join Table)
UserExercise.belongsTo(User, { foreignKey: 'user_id' });
UserExercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });

// Reward associations
Reward.belongsTo(Exercise, { foreignKey: 'exercise_id' });

// LoginHistory associations
LoginHistory.belongsTo(User, { foreignKey: 'user_id' });

const db = {
  sequelize,
  User,
  Post,
  Comment,
  Exercise,
  UserExercise,
  Reward,
  LoginHistory
};

export default db;