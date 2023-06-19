import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'

import { ZodError } from 'zod'

import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { checkInRoutes } from './http/controllers/check-ins/check-ins.routes'
import { gymRoutes } from './http/controllers/gyms/gyms.routes'
import { userRoutes } from './http/controllers/users/users.routes'


export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m',
  }
})

app.register(fastifyCookie)

app.register(userRoutes, { prefix: '/users' })
app.register(gymRoutes, { prefix: '/gyms' })
app.register(checkInRoutes, { prefix: '/check-ins' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ 
      message: 'Validation error', 
      issues: error.issues.map(issue => `${issue.path.join('.')} is ${issue.message.toLocaleLowerCase()}`)
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Send error to Sentry, Datadog, NewRelic
  }

  return reply.status(500).send({ message: 'Internal server error' })
})