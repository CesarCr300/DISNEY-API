const jwt = require('jsonwebtoken')
const { model } = require('./model')
const { TOKEN_JWT } = require('../config')
module.exports.isUser = async(req, res, next) => {
    try {
        const token = req.get('access-token')
        if (!token) return res.status(400).json({ error: "Necesitas un token" })
        jwt.verify(token, TOKEN_JWT)
        next()
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}