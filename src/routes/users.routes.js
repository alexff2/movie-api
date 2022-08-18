const { Router } = require('express')

const UsersController = require('../controllers/UsersController')

const usersRoute = Router()

usersRoute.post('/', UsersController.create)
usersRoute.put('/:id', UsersController.update)

module.exports = usersRoute