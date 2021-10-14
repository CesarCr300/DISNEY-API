const { character } = require("./models/character")
const { video } = require("./models/video")

video.belongsToMany(character, { through: "video_characters" })
character.belongsToMany(video, { through: "video_characters" })