const { hash, compare } = require('bcryptjs')

const knex = require('../database/knex')
const AppError = require('../utils/AppError')

module.exports =  {
  async create(request, response) {
    const { name, email, password } = request.body

    if(!name || !email || !password) {
      throw new AppError('Informe todos os campos obrigatórios!')
    }

    const checkUserExiste = await knex('users').where({ email }).first()
    if (checkUserExiste) {
      throw new AppError('Esse email já está cadastrado')
    }

    const passwordHash = await hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: passwordHash
    })

    return response.status(201).json()
  },
  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const user = await knex('users').where({ id }).first()

    if(!user) {
      throw new AppError('Usuário não encontrado!')
    }

    if (email) {
      const checkUserEmail = await knex('users').where({ email }).first()
  
      if(checkUserEmail && checkUserEmail.id !== user.id) {
        throw new AppError('E-mail já usado em outro cadastro!')
      }
    }

    if(password && !old_password) {
      throw new AppError('Senhas não conferem!')
    }

    const checkPassword = await compare(old_password, user.password)

    if (!checkPassword) {
      throw new AppError('Senha antiga inválida!')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    const passwordHash = await hash(password, 8)

    await knex('users').where({ id }).update({
      name: user.name,
      email: user.email,
      password: passwordHash
    })

    return response.json()
  }
}