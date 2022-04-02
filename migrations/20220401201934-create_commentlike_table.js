'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('CommentLikes', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      commentId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE

    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('CommentLikes')
  }
};
