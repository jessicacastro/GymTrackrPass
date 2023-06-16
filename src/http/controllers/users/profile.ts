import { makeUserProfileUseCase } from '@/use-cases/factories'
import { exclude } from '@/utils/exclude'
import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userProfileUseCase } = makeUserProfileUseCase()
    
    const { user } = await userProfileUseCase.execute({ userId: request.user.sub })

    const userWithoutPassword = exclude(user, ['password_hash'])

    return reply.status(200).send({ user: userWithoutPassword })    
  } catch (error) {
    throw error
  }

  return reply.status(200).send()
}
