const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})

const Character = sequelize.define('characters', { img: Sequelize.STRING, name: Sequelize.TEXT, age: Sequelize.INTEGER, history: Sequelize.TEXT, weight: Sequelize.FLOAT })

//formate dateonly month/day/year

const Video = sequelize.define('videos', { img: Sequelize.STRING, title: Sequelize.TEXT, calification: Sequelize.INTEGER, creationDate: Sequelize.DATEONLY })
sequelize.sync()
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports.connectionDB = function() {
    sequelize.authenticate().then((d) => { console.log("DB Connected") }).catch(console.error)
}

module.exports.character = Character
module.exports.video = Video