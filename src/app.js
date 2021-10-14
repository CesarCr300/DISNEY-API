const express = require('express');
const app = express();

const characters = require("./character")
const movies = require("./movie")

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set("port", process.env.PORT || 3000);

app.use("/characters", characters.router)
app.use("/movies", movies.router)

module.exports = app