const express = require('express')
const router = express.Router()

const { getCharacters, postCharacter, deleteCharacter, getCharacter, updateCharacter } = require("./controllers")
router.route("/")
    .get(getCharacters)
    .post(postCharacter)
router.route("/:characterId")
    .get(getCharacter)
    .delete(deleteCharacter)
    .patch(updateCharacter)

module.exports.router = router