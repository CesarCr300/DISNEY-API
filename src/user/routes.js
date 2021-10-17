const { register } = require('./controllers')
const router = require('express').Router()

router.get("/register", register)

router.get("/", async(req, res) => {
    res.send("User")
})

module.exports.router = router