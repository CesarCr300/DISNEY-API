const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { user } = require('../db')
const { TOKEN_JWT, TOKEN_SENDGRID, EMAIL_SENDGRID } = require("../config")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(TOKEN_SENDGRID)

module.exports.register = async(req, res, next) => {
    try {
        let { email, password } = req.body
        password = await bcrypt.hashSync(password, 8)
        const userCreated = await user.create({ email, password })
        const token = jwt.sign({ id: userCreated.id }, TOKEN_JWT, { expiresIn: 60 * 60 })
        const messageWelcome = {
            to: email,
            from: {
                email: EMAIL_SENDGRID,
                name: "Disney Servicios"
            },
            subject: "Te damos la bienvenida a nuestra comunidad",
            text: "Has creado exitasomante tu cuenta en Disney Servicios."
        }
        try { await sgMail.send(messageWelcome) } catch (err) { console.log("Corrobore la cuenta sendgrid") }
        res.status(201).json({ token })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports.login = async(req, res, next) => {
    try {
        let { email, password } = req.body
        const userFounded = await user.findOne({ where: { email } })
        if (userFounded) {
            const isUser = bcrypt.compareSync(password, userFounded.password)
            if (!isUser) return res.status(404).json({ err: "Email o contraseña invalidos" })
            const token = jwt.sign({ id: userFounded.id }, TOKEN_JWT)
            return res.json({ token })
        }
        return res.status(404).json({ err: "Email o contraseña invalidos" })

    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}