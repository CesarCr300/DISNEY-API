const { model } = require('./model')
const { router } = require('./routes')
const { isUser } = require("./middleware")

module.exports = { model, router, isUser }