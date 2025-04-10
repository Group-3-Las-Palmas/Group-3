'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_history', { // Basado en models/loginHistory.js
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      login_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
      // No createdAt/updatedAt porque timestamps: false en el modelo
    });
     // Añadir un índice en user_id puede mejorar el rendimiento de las búsquedas
     await queryInterface.addIndex('login_history', ['user_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('login_history');
  }
};