const Sequelize = require('sequelize')
const { sequelize } = require("../index")

module.exports.user = sequelize.define('users', {
    timestamps: false,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "El email ya esta siendo usado"
        },
        validate: {
            isEmail: {
                msg: "Debe ingresar un email válido"
            },
            notNull: {
                msg: "Debe ingresar un email"
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Debe ingresar una contraseña"
            }
        }
    }
})