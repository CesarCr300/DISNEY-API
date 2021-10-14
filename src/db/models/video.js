const Sequelize = require('sequelize')
const { sequelize } = require("../index")

module.exports.video = sequelize.define('videos', { img: Sequelize.STRING, title: Sequelize.TEXT, calification: Sequelize.INTEGER, creationDate: Sequelize.DATEONLY })