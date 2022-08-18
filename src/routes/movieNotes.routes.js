const { Router } = require('express')

const MovieNotesController = require('../controllers/MovieNotesController')

const routeMovieNote = Router()

routeMovieNote.get('/', MovieNotesController.index)
routeMovieNote.post('/', MovieNotesController.create)
routeMovieNote.get('/:id', MovieNotesController.show)
routeMovieNote.delete('/:id', MovieNotesController.delete)

module.exports = routeMovieNote