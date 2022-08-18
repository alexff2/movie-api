const { Router } = require('express')

const TagsController = require('../controllers/TagsController')

const tagsRoute = Router()

tagsRoute.get('/', TagsController.index)

module.exports = tagsRoute