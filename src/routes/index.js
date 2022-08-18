const { Router } = require('express')

const usersRoute = require('./users.routes')
const movieNotesRoute = require('./movieNotes.routes')
const tagsRoute = require('./tags.routes')

const routes = Router()

routes.use('/users', usersRoute)
routes.use('/notes', movieNotesRoute)
routes.use('/tags', tagsRoute)

module.exports = routes