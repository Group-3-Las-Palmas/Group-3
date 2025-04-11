import sequelize from "../db.js";
import { DataTypes } from "sequelize"; 
const UserExercise = sequelize.define(
    "UserExercise",
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            },
        },
        exercise_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "exercises",
                key: "exercise_id"
            },
        },
        completed_times: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0 
        },
        is_favourite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    },
    {
        tableName: "user_exercises", 
        timestamps: false           
    }
    // ------------------------------------
);

export default UserExercise;