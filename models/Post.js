const Sequelize = require('sequelize')
const sequelize = require('../connection')

module.exports = sequelize.define("Posts", {

  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  }

});