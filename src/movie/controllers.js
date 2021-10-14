const { model } = require('./model')
const { Op } = require('sequelize')
const { gender } = require('../db')
const character = require("../character/model")


module.exports.getMovies = async(req, res, next) => {
    try {
        let { name, gender, order } = req.query
        if (!name) name = ''
        let orderValues = []
        if (order === 'ASC' || order === 'DESC') {
            orderValues = [
                ["creationDate", order]
            ]
        }
        const movies = await model.findAll({
            attributes: [
                ["img", "Imagen"],
                ["title", "Título"],
                ["creationDate", "Fecha de creación"]
            ],
            where: {
                title: {
                    [Op.startsWith]: name
                }
            },
            order: orderValues
        })
        res.json(movies)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.getMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        const movieFounded = await model.findByPk(movieId, {
            include: character.model
        })
        res.json(movieFounded)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.postMovie = async(req, res, next) => {
    try {
        console.log("gender", gender)
        console.log("model", model)
        const { img, title, calification, creationDate } = req.body
        const newMovie = await model.create({ img, title, calification, creationDate })
        if (req.body.genders) {
            for (let id of req.body.genders) {
                const genderFounded = await gender.findByPk(id)
                genderFounded.addVideo(newMovie)
            }
        }
        if (req.body.characters) {
            for (let characterId of req.body.characters) {
                let characterFounded = await character.model.findByPk(characterId)
                newMovie.addCharacter(characterFounded)
            }
        }
        res.status(201).json(newMovie)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.updateMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        const { img, title, calification, creationDate } = req.body

        await model.update({ img, title, calification, creationDate }, { where: { id: movieId } })
        const movieFounded = await model.findByPk(movieId)
        if (req.body.genders) {
            let gendersList = []
            for (let id of req.body.genders) {
                gendersList.push(await gender.findByPk(id))
            }
            movieFounded.setGender(gendersList)
        }
        if (req.body.characters) {
            let characters = []
            for (let characterId of req.body.characters) {
                let characterFounded = await character.model.findByPk(characterId)
                characters.push(characterFounded)
            }
            movieFounded.setCharacters(characters)
        }
        res.json({ message: "Movie/Serie updated" })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.deleteMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        await model.destroy({ where: { id: movieId } })
        res.json({ message: "Movie/Serie deleted" })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}