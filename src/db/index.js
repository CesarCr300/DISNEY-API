const Sequelize = require('sequelize')
let databaseName = './disneyServices.sqlite'
if (process.env.NODE_ENV === 'test') databaseName = './disneyServices-test.sqlite'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databaseName,
    define: {
        timestamps: false
    },
    logging: false
})
module.exports.sequelize = sequelize

const { character } = require("./models/character")
const { video } = require("./models/video")
const { gender } = require("./models/gender")
const { user } = require("./models/user")
const seeds = require("./seeds")
module.exports.connectionDB = async function() {
    try {
        let valueForce = false
        let test = false
        if (process.env.NODE_ENV === 'test') {
            test = true
            valueForce = true
        }
        require("./asociations")
        await sequelize.sync({ force: valueForce })
            .then(() => {})
        sequelize.authenticate().then((d) => {}).catch(console.error)
        if (test) {
            await seeds()
        } else if (valueForce) {
            await gender.create({ name: "fantasia" })
            await gender.create({ name: "accion" })
            await gender.create({ name: "infantil" })
            await gender.create({ name: "comedia" })
            await gender.create({ name: "animacion" })
        }

    } catch (err) { console.log(err) }
}

module.exports.gender = gender
module.exports.character = character
module.exports.video = video
module.exports.user = user