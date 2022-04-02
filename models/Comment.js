const Sequelize = require('sequelize')
const sequelize = require('../connection')

module.exports = sequelize.define("Comment", {

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
  }

});