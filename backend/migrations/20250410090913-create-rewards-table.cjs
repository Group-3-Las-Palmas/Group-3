'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rewards', { // Basado en models/rewards.js
      reward_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      exercise_id: { // Clave foránea
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'exercise_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // O la acción que prefieras
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      badge: {
        type: Sequelize.BLOB, // BLOB para datos binarios (imágenes)
        allowNull: true
      },
      earned_at: {
        type: Sequelize.DATE,
        allowNull: true // Permitir null como en el modelo
      }
      // No createdAt/updatedAt porque timestamps: false en el modelo
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rewards');
  }
};