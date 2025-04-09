// backend/models/loginHistory.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  login_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'login_history',
  timestamps: false
});

export default LoginHistory;