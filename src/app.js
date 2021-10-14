const express = require('express');
const app = express();

const characters = require("./character")

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set("port", process.env.PORT || 3000);

app.use("/characters", characters.router)

module.exports = app