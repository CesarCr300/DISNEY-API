const { register, login } = require('./controllers')
const router = require('express').Router()

router.get("/register", register)
router.get("/login", login)

module.exports.router = router