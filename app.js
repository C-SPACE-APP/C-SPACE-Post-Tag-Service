const startBackend = require('./utils/backendStarter')
const initializeDatabase = require('./utils/initializeDatabase')
const {Authenticate} = require('./middlewares')

const port = process.env.PORT || 3006



if(initializeDatabase())
    startBackend(port)

