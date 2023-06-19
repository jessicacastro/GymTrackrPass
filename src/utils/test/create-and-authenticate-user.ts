import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateUser = async (app: FastifyInstance) => {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: '12345678'
  })

  const authResponse = await request(app.server).post('/users/session').send({
    email: 'johndoe@email.com',
    password: '12345678'
  })

  const { token } = authResponse.body

  return { token }
}