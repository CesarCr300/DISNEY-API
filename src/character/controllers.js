const { model } = require('./model')
const { Op } = require('sequelize')
const video = require("../movie")
require('../db/asociations')

module.exports.getCharacters = async(req, res, next) => {
    try {
        let { name, age, movies, weight } = req.query
        const queryData = { age, weight }
        let whereValues = {}
        if (name === undefined || name === null) {
            name = ""
        }
        let includeSearchByMovie = []
        if (movies !== undefined && movies !== null) {
            includeSearchByMovie = [{
                model: video.model,
                where: { id: movies },
                attributes: []
            }]
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
            },
            include: includeSearchByMovie
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
        if (req.body.movies) {
            let videoIds = req.body.movies
            for (let id of videoIds) {
                let movieFounded = await video.model.findByPk(id)
                await movieFounded.addCharacter(newCharacter)
            }
        }
        res.status(201).json(newCharacter)
    } catch (err) {
        res.status(400).json({ err: err.message })
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
            ],
            include: video.model
        })
        res.json(characterFounded)
    } catch (err) { res.status(400).json({ err: err.message }) }

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
        const character = await model.findByPk(characterId)
        let movies = []
        if (req.body.movies) {
            for (let movie of req.body.movies) {
                movies.push(await video.model.findByPk(movie))
            }
        }
        character.setVideos(movies)
        if (characterUpdated[0] !== 0) return res.json({ message: "Character updated" })
        res.json({ message: "You need a valid id" })
    } catch (err) { res.status(400).json({ err: err.message }) }
}