const Sequelize = require('sequelize')
const sequelize = require('../connection')

module.exports = sequelize.define("PostLikes", {

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
  postId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  }

});