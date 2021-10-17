const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { user } = require('../db')
const { TOKEN_JWT } = require("../config")

module.exports.register = async(req, res, next) => {
    try {
        let { email, password } = req.body
        password = await bcrypt.hashSync(password, 8)
        console.log(TOKEN_JWT)
        const userCreated = await user.create({ email, password })
        const token = jwt.sign({ id: userCreated._id }, TOKEN_JWT)
        res.json({ token })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}