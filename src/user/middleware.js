const jwt = require('jsonwebtoken')
const { TOKEN_JWT } = require('../config')
const { model } = require('./model')
module.exports.isUser = async(req, res, next) => {
    try {
        const token = req.get('access-token')
        if (!token) return res.status(400).json({ err: "Necesitas un token" })

        const infoToken = jwt.verify(token, TOKEN_JWT)
        if (!infoToken.id) return res.status(401).json({ err: "Necesitas un token valido" })

        const userFounded = await model.findByPk(infoToken.id)
        if (!userFounded) return res.status(401).json({ err: "Necesitas un token valido" })

        next()
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}