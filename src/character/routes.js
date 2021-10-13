const express = require('express')
const router = express.Router()

const { model } = require("./model")
const { video } = require("../db")
    // router.get("/", async(req, res, next) => {
    //     model.create({ img: "www.image.com", "name": "Robert DJ", age: 70, history: "He was born in Italy", weight: 70.5 })
    //     const data = await video.findAll()
    //     res.json(data)
    // })

// router.get("/create", async(req, res, next) => {
//     await model.create({ img: "www.image.com", "name": "Robert DJ", age: 70, history: "He was born in Italy", weight: 70.5 })
//     res.json("creado")
// })

// router.get("/createMovie", async(req, res, next) => {
//     await video.create({ img: "imagen", title: "IW", calification: 5, creationDate: "10/14/2020" })
//     res.json("creado")
// })

module.exports.router = router