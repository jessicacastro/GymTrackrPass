import { FastifyReply, FastifyRequest } from 'fastify'


export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify({ onlyCookie: true })

  const { role, sub } = request.user

  const token = await reply.jwtSign({
    role
  }, {
    sign: {
      sub: sub
    }
  })

  const refreshToken = await reply.jwtSign({
    role
  }, {
    sign: {
      sub: sub,
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
