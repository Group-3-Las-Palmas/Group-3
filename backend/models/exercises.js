import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Exercise = sequelize.define(
  "Exercise",
  {
    exercise_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    goal: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "exercises",
    timestamps: false,
  }
);

export default Exercise;
