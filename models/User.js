const Sequelize = require('sequelize')
const sequelize = require('../connection')

module.exports = sequelize.define("Users", {

  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  lastname: {
    type: Sequelize.STRING(20),
    allowNull: false,
  }

});