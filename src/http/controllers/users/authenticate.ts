import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors'
import { makeAuthenticateUseCase } from '@/use-cases/factories'

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)
  
  try {
    const { authenticateUseCase } = makeAuthenticateUseCase()
    
    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // what routes should have access to this cookie (all routes)
        secure: true, // only send cookie over https (true in production)
        sameSite: true, // only send cookie if request is coming from the same origin as the server (true in production)
        httpOnly: true, // prevent JS from reading this cookie (true in production) (request and response of backend)
      })
      .status(200)
      .send({ token })
    
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

   throw error
  }
}
