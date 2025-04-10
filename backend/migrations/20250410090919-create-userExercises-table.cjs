'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ¡OJO! El modelo se llama UserExercise pero la tabla asociada suele ser plural o descriptiva
    // Verifica el nombre real de la tabla en tu base de datos si ya existe, o elige uno (ej. user_exercises)
    // Usaré 'user_exercises' como ejemplo, ajústalo si es necesario.
    await queryInterface.createTable('user_exercises', { // Nombre de tabla tentativo, basado en models/userExercises.js
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
      exercise_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'exercise_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      completed_times: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // Valor por defecto como en el modelo
      },
      is_favourite: {
        type: Sequelize.BOOLEAN,
        allowNull: false, // Not null como en el modelo
        defaultValue: false // Valor por defecto como en el modelo
      }
      // No createdAt/updatedAt explícitos si usas timestamps: true en el modelo,
      // pero tu modelo userExercises.js no especifica timestamps, así que probablemente no los necesites.
      // Si los necesitaras, Sequelize los añadiría por defecto si no pones timestamps: false.
    });
     // Considera añadir índices compuestos si realizas búsquedas frecuentes por user_id y exercise_id juntos
     // await queryInterface.addIndex('user_exercises', ['user_id', 'exercise_id'], { unique: true }); // Ejemplo si la combinación debe ser única
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_exercises'); // Usa el mismo nombre de tabla que en up()
  }
};