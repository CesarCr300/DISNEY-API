const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    define: {
        timestamps: false
    },
})
module.exports.sequelize = sequelize

const { character } = require("./models/character")
    //formate dateonly month/day/year
const { video } = require("./models/video")
const { gender } = require("./models/gender")

module.exports.connectionDB = async function() {
    try {
        require("./asociations")
        await sequelize.sync({ force: false })
            .then(() => {
                console.log(`Database & tables created!`)
            })
        sequelize.authenticate().then((d) => { console.log("DB Connected") }).catch(console.error)
        await gender.create({ name: "fantasia" })
        await gender.create({ name: "accion" })
        await gender.create({ name: "infantil" })
        await gender.create({ name: "comedia" })
        await gender.create({ name: "animacion" })
    } catch (err) {

    }
}

module.exports.gender = gender
module.exports.character = character
module.exports.video = video