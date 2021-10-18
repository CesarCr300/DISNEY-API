const { model } = require('./model')
const { Op } = require('sequelize')
const { gender } = require('../db')
const character = require("../character/model")


module.exports.getMovies = async(req, res, next) => {
    try {
        let { name, genre, order } = req.query
        if (!name) name = ''

        let includeSearchByGender = []
        if (genre) {
            includeSearchByGender = [{
                model: gender,
                where: { id: genre },
                attributes: []
            }]
        }
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
            include: includeSearchByGender,
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

        const updatedMovie = await model.update({ img, title, calification, creationDate }, { where: { id: movieId } })

        if (updatedMovie === 0) return res.status(404).json({ err: "Ingrese un movieId válido" })

        const movieFounded = await model.findByPk(movieId)

        if (!movieFounded) return res.status(404).json({ err: "Ingrese un movieId válido" })
        if (req.body.genders) {
            let gendersList = []
            for (let id of req.body.genders) {
                gendersList.push(await gender.findByPk(id))
            }
            movieFounded.setGenders(gendersList)
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
        const movieDeleted = await model.destroy({ where: { id: movieId } })
        if (movieDeleted === 0) return res.status(404).json({ err: "Ingrese un movieId válido" })
        res.json({ message: "Movie/Serie deleted" })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}