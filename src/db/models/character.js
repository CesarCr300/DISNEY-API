const Sequelize = require('sequelize')
const { sequelize } = require("../index")

module.exports.character = sequelize.define('characters', { img: Sequelize.STRING, name: Sequelize.TEXT, age: Sequelize.INTEGER, history: Sequelize.TEXT, weight: Sequelize.FLOAT })