import sequelize from "../db.js";
import { DataTypes } from "sequelize"

const userExercise = sequelize.define(
    "UserExercise",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: "users",
                key: "user_id" 
            },
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: "exercises",
                key: "exercise_id" 
            },
        },
        completed_times: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_favourite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
    });
      
export default UserExercise;