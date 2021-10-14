const { model } = require('./model')
const character = require("../character/model")

module.exports.getMovies = async(req, res, next) => {
    const movies = await model.findAll({ attributes: ["img", "title", "creationDate"] })
    res.json(movies)
}

module.exports.getMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        const movieFounded = await model.findByPk(movieId, {
            include: character.model
        })
        res.json(movieFounded)
    } catch (err) {
        res.status(400).json({ err })
    }
}

module.exports.postMovie = async(req, res, next) => {
    try {
        const { img, title, calification, creationDate } = req.body
        console.log(title)
        const newMovie = await model.create({ img, title, calification, creationDate })
        if (req.body.characters) {
            for (let characterId of req.body.characters) {
                let characterFounded = await character.model.findByPk(characterId)
                newMovie.addCharacter(characterFounded)
            }
        }
        res.status(201).json(newMovie)
    } catch (err) {
        res.status(400).json({ err })
    }
}

module.exports.updateMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        const { img, title, calification, creationDate } = req.body

        await model.update({ img, title, calification, creationDate }, { where: { id: movieId } })
        res.json({ message: "Movie/Serie deleted" })
    } catch (err) {
        res.status(400).json({ err })
    }
}

module.exports.deleteMovie = async(req, res, next) => {
    try {
        const { movieId } = req.params
        await model.destroy({ where: { id: movieId } })
        res.json({ message: "Movie/Serie deleted" })
    } catch (err) {
        res.status(400).json({ err })
    }
}