import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'post_id'
    }
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  create_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comments',
  timestamps: false
});


export default Comment;