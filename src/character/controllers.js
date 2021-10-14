const { model } = require('./model')
const { Op } = require('sequelize')
const video = require("../movie")
require('../db/asociations')

module.exports.getCharacters = async(req, res, next) => {
    try {
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
    } catch (err) {
        res.status(400).json(err)
    }
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
        if (req.body.videoId) {
            let videoIds = req.body.videoId
            for (let id of videoIds) {
                let movieFounded = await video.model.findByPk(id)
                await movieFounded.addCharacter(newCharacter)
            }
        }
        res.status(201).json(newCharacter)
    } catch (err) {
        console.log(err)
        res.status(400).json({ err })
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
    } catch (err) { res.status(400).json({ err }) }

}

module.exports.deleteCharacter = async(req, res, next) => {
    try {
        const { characterId } = req.params
        await model.destroy({ where: { id: characterId } })
        res.send({ message: "Character deleted" })
    } catch (err) { res.status(400).json({ err }) }
}

module.exports.updateCharacter = async(req, res, next) => {
    try {
        const { characterId } = req.params
        const { img, name, age, history, weight } = req.body
        const characterUpdated = await model.update({ img, name, age, history, weight }, { where: { id: characterId } })

        if (characterUpdated[0] !== 0) return res.json({ message: "Character updated" })
        res.json({ message: "You need a valid id" })
    } catch (err) { res.status(400).json({ err }) }
}