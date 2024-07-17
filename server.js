const { app } = require('./app')

const port = 8080

if (require.main === module) {
  app.listen(() => console.log(`listening on port ${port}`))
}

module.exports.app = app
