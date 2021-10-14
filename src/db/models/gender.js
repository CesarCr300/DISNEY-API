const { sequelize } = require("../index")
const Sequelize = require("sequelize")

module.exports.gender = sequelize.define('genders', {
    timestamps: false,
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El género debe tener un nombre"
            }
        }
    },
    img: {
        type: Sequelize.STRING,
    }
})