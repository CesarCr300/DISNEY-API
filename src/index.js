const app = require('./app')

const { connectionDB } = require('./db')

connectionDB()

app.listen(app.get('port'), (req, res) => {})