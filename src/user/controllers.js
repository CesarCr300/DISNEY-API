const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { model } = require('./')

module.exports.register = async(req, res, next) => {
    try {
        let { email, password } = req.body
        password = await bcrypt.hashSync(password, 8)
            // const user = await model.create({ email, })
        res.json(password)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}