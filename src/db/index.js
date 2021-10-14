const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})
module.exports.sequelize = sequelize

const { character } = require("./models/character")

//formate dateonly month/day/year

const { video } = require("./models/video")


module.exports.connectionDB = function() {
    require("./asociations")
    sequelize.sync({ force: false })
        .then(() => {
            console.log(`Database & tables created!`)
        })
    sequelize.authenticate().then((d) => { console.log("DB Connected") }).catch(console.error)
}

module.exports.character = character
module.exports.video = video