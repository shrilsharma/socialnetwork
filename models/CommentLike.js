const Sequelize = require('sequelize')
const sequelize = require('../connection')

module.exports = sequelize.define("CommentLikes", {

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
  }

});