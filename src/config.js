require("dotenv").config()
console.log(process.env.TOKEN_JWT)
module.exports = {
    "TOKEN_JWT": process.env.TOKEN_JWT
}