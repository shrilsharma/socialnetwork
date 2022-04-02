'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Comment', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      content: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      postId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Comment')
  }
};
