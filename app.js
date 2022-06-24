const startBackend = require('./utils/backendStarter')
const initializeDatabase = require('./utils/initializeDatabase')


const port = process.env.PORT || 3007



if(initializeDatabase())
    startBackend(port)

