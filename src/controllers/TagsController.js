const knex = require('../database/knex')

module.exports = {
  async index(request, response ) {
    const tags = await knex('movie_tags')

    return response.json(tags)
  }
}