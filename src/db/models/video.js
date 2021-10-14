const Sequelize = require('sequelize')
const { sequelize } = require("../index")

module.exports.video = sequelize.define('videos', {
    img: Sequelize.STRING,
    title: Sequelize.TEXT,
    calification: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: 1,
                msg: 'La calificación debe ser mayor que 0'
            },
            man: {
                args: 5,
                msg: 'La calificación debe ser menor que 6'
            }
        }
    },
    creationDate: Sequelize.DATEONLY
})