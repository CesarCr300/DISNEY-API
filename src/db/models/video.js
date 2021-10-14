const Sequelize = require('sequelize')
const { sequelize } = require("../index")

module.exports.video = sequelize.define('videos', {
    img: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El título no puede ser nulo'
            }
        }
    },
    calification: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: 1,
                msg: "La calificación debe ser mayor que 0"
            },
            man: {
                args: 5,
                msg: "La calificación debe ser menor que 6"
            }
        }
    },
    creationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La fecha de creación no puede ser nulo'
            }
        }
    }
})