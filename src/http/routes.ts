import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { register } from './controllers/register'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/users/session', authenticate)
}
