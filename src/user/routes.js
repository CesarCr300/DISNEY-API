const router = require('express').Router()

router.get("/", async(req, res) => {
    res.send("User")
})

module.exports.router = router