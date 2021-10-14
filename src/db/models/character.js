const Sequelize = require('sequelize')
const { sequelize } = require('../index')

module.exports.character = sequelize.define('characters', {
    img: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El nombre no puede ser nulo"
            },
        }
    },
    age: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: 1,
                msg: "La edad debe ser mayor que 0"
            },
            isInt: {
                args: true,
                msg: "La edad debe de ser entera"
            }
        }
    },
    history: Sequelize.TEXT,
    weight: Sequelize.FLOAT
}, { timestamps: false })