const knex = require('../database/knex')
const AppError = require('../utils/AppError')

module.exports = {
  async index(request, response) {
    const { user_id, title, tags } = request.query

    let movie_notes

    if (!tags) {
      movie_notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')

    } else {
      const filterTags = tags.split(',').map(tag => tag.trim())

      movie_notes = await knex('movie_notes')
        .select(
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_notes.user_id',)
        .innerJoin('movie_tags', 'movie_notes.id', 'movie_tags.note_id')
        .where('movie_notes.user_id', user_id)
        .whereLike('title', `%${title}%`)
        .whereIn('movie_tags.name', filterTags)
        .groupBy(
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_notes.user_id',)
        .orderBy('title')
    }

    const movie_tags = await knex('movie_tags').where({ user_id })

    const movie_notes_tags = movie_notes.map( notes => {
      let tags = movie_tags.filter( tag => notes.id === tag.note_id)
      return {
        ...notes,
        tags
      }
    })

    return response.json(movie_notes_tags)
  },
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const { user_id } = request.query

    if (!title, !rating, !tags) {
      throw new AppError('Preencha todos os valores obrigatórios!')
    }

    if (typeof rating !== 'number') {
      throw new AppError('O valor da nota deve ser caractere numérico!')
    }

    if (rating < 0 || rating > 5) {
      throw new AppError('O valor da nota deve ser entre 1 e 5')
    }

    const note_id = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id
    })

    const newTags = tags.map( name => ({
      name,
      note_id,
      user_id
    }))

    await knex('movie_tags').insert(newTags)

    return response.status(201).json()
  },
  async show(request, response) {
    const { id } = request.params
    const { user_id } = request.query

    const movie_notes = await knex('movie_notes').where({ id, user_id }).first()

    const tags = await knex('movie_tags').where({ note_id: id })

    return response.json({ ...movie_notes, tags })
  },
  async delete(request, response) {
    const { id } = request.params
    const { user_id } = request.query

    const movie_notes = await knex('movie_notes').where({ id }).first()

    if (!user_id) {
      throw new AppError('Forneça o número do usuário!')
    }

    if (!movie_notes) {
      throw new AppError('Número de nota não existe!')
    }
    
    if (movie_notes.user_id !== parseInt(user_id)) {
      throw new AppError('Essa nota não pertence ao usuário fornecido!')
    }

    await knex('movie_notes').delete().where({ id })

    return response.json()
  }
}