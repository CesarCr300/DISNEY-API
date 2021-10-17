const express = require('express')
const router = express.Router()
const { getCharacters, postCharacter, deleteCharacter, getCharacter, updateCharacter } = require("./controllers")

const { isUser } = require('../user')

router.use(isUser)

router.route("/")
    .get(getCharacters)
    .post(postCharacter)
router.route("/:characterId")
    .get(getCharacter)
    .delete(deleteCharacter)
    .patch(updateCharacter)

module.exports.router = router