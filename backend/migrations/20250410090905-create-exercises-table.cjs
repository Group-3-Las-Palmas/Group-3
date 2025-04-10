'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exercises', { // Basado en models/exercises.js
      exercise_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true // Permitir null como en el modelo
      },
      time: {
        type: Sequelize.BIGINT, // Asegúrate que el tipo coincida (INT o BIGINT)
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      goal: {
        type: Sequelize.BIGINT, // Asegúrate que el tipo coincida
        allowNull: true
      }
      // No createdAt/updatedAt porque timestamps: false en el modelo
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exercises');
  }
};