const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { user } = require('../db')
const { TOKEN_JWT } = require("../config")

module.exports.register = async(req, res, next) => {
    try {
        let { email, password } = req.body
        password = await bcrypt.hashSync(password, 8)
        const userCreated = await user.create({ email, password })
        const token = jwt.sign({ id: userCreated.id }, TOKEN_JWT)
        res.status(201).json({ token })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.login = async(req, res, next) => {
    try {
        let { email, password } = req.body
        console.log(email)
        const userFounded = await user.findOne({ where: { email } })
        if (userFounded) {
            const isUser = bcrypt.compareSync(password, userFounded.password)
            console.log(userFounded)
            if (!isUser) return res.status(401).json({ err: "Debes ser un usuario" })
            const token = jwt.sign({ id: userFounded._id }, TOKEN_JWT)
            return res.json({ token })
        }
        return res.status(400).json({ err: "Ingresa un usuario existente" })

    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}