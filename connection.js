const Sequelize = require('sequelize')

const sequelize = new Sequelize('socialnetwork', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  operatorsAliases: false
})

module.exports = sequelize