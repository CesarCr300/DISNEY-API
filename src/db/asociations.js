const { character } = require("./models/character")
const { video } = require("./models/video")
const { gender } = require("./models/gender")

//Relation M to N between characters and videos

character.belongsToMany(video, { through: "video_characters" })
video.belongsToMany(character, { through: "video_characters" })

//Relation M to Many videos an gender

// gender.belongsToMany(video, { through: "video_gender" })
// video.belongsToMany(gender, { through: "video_gender" })