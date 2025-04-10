import sequelize from "../db.js";
import { DataTypes } from "sequelize"; // Asegúrate que DataTypes está importado

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
            defaultValue: 0 // Cambiado a 0? O mantenlo en 1 si prefieres. 0 tiene más sentido si se crea al marcar fav.
        },
        is_favourite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    },
    {
        tableName: "user_exercises", // Nombre correcto de la tabla
        timestamps: false           // Asumiendo que no usas createdAt/updatedAt
    }
    // ------------------------------------
);

export default UserExercise;