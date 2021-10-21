require("dotenv").config()
module.exports = {
    "TOKEN_JWT": process.env.TOKEN_JWT,
    "TOKEN_SENDGRID": process.env.TOKEN_SENDGRID,
    "EMAIL_SENDGRID": process.env.EMAIL_SENDGRID,
}