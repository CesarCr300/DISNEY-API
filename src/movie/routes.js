const { getMovies, postMovie, getMovie, updateMovie, deleteMovie } = require('./controllers')

const { isUser } = require("../user")

const router = require('express').Router()

router.use(isUser)

router.route("/")
    .get(getMovies)
    .post(postMovie)

router.route("/:movieId")
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

module.exports.router = router