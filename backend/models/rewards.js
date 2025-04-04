import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Reward = sequelize.define(
    "Reward",
    {
        reward_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        exercise_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "exercises",
                key: "exercise_id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        badge: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        earned_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "rewards",
        timestamps: false,
    }
);

export default Reward;