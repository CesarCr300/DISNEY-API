const { model } = require('./model')
const { Op } = require('sequelize')

module.exports.getCharacters = async(req, res, next) => {
    let { name, age, movies, weight } = req.query
    const queryData = { age, movies, weight }
    let whereValues = {}
    if (name === undefined || name === null) {
        name = ""
    }
    for (let data in queryData) {
        if (queryData[data] !== undefined) {
            whereValues[data] = queryData[data]
        }
    }
    const characters = await model.findAll({
        attributes: [
            ["img", "Imagen"],
            ["name", "Nombre"]
        ],
        where: {
            name: {
                [Op.startsWith]: name
            },
            ...whereValues
        }
    })
    res.json(characters)
}

module.exports.postCharacter = async(req, res, next) => {
    try {
        const { img, name, age, history, weight } = req.body
        const newCharacter = await model.create({
            img,
            name,
            age,
            history,
            weight,
        })
        res.status(201).json(newCharacter)
    } catch (err) {
        res.json({ err })
    }
}

module.exports.getCharacter = async(req, res, next) => {
    try {
        const { characterId } = req.params
        const characterFounded = await model.findByPk(characterId, {
            attributes: [
                ["img", "Imagen"],
                ["name", "Nombre"],
                ["age", "Edad"],
                ["weight", "Peso"],
                ["history", "Historia"],
            ]
        })
        res.json(characterFounded)
    } catch (err) { res.json(err) }

}

module.exports.deleteCharacter = async(req, res, next) => {
    try {
        const { characterId } = req.params
        await model.destroy({ where: { id: characterId } })
        res.send({ message: "Character deleted" })
    } catch (err) {}
}

module.exports.updateCharacter = async(req, res, next) => {
    try {
        const { characterId } = req.params
        const { img, name, age, history, weight } = req.body
        const characterUpdated = await model.update({ img, name, age, history, weight }, { where: { id: characterId } })

        if (characterUpdated[0] !== 0) return res.json({ message: "Character updated" })
        res.json({ message: "You need a valid id" })
    } catch (err) {}
}