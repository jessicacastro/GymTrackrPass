import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
  })

  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub
    }
  })

  const refreshToken = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub,
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

  return reply.status(201).send()
}
