const { character } = require("./models/character")
const { video } = require("./models/video")

character.belongsToMany(video, { through: "video_characters" })
video.belongsToMany(character, { through: "video_characters" })