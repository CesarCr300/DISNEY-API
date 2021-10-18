const { character } = require("./models/character")
const { video } = require("./models/video")

module.exports = async function() {
    const serie1 = await video.create({
        title: "Phineas y Ferb",
        calification: 5,
        creationDate: "10/10/2021"
    })
    const serie2 = await video.create({
        title: "La casa de micky mouse",
        calification: 4,
        creationDate: "10/12/2019"
    })
    const phineas = await character.create({
        name: "Phineas",
        age: 15
    })
    const ferb = await character.create({
        name: "Ferb",
        age: 18
    })
    serie1.setCharacters([phineas, ferb])
    const micky = await character.create({
        name: "Micky",
        age: 20
    })
    const mini = await character.create({
        name: "Minnie",
        age: 19
    })
    serie2.setCharacters([micky, mini])
}