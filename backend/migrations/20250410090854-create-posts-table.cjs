'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', { // Basado en models/posts.js
      post_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { // Clave foránea
          model: 'users', // Nombre de la tabla referenciada
          key: 'user_id'
        },
        onUpdate: 'CASCADE', // Opcional: acción en actualización
        onDelete: 'CASCADE'  // Opcional: acción en borrado (o SET NULL, etc.)
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      create_at: { // Nombre de columna como en el modelo
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW // Usar Sequelize.NOW para el valor por defecto
      }
      // No createdAt/updatedAt porque timestamps: false en el modelo
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};