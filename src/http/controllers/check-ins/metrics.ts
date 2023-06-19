import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories'

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const { getUserMetricsUseCase } = makeGetUserMetricsUseCase()
    
  const { totalCheckIns } = await getUserMetricsUseCase.execute({ userId: request.user.sub })

  return reply.status(200).send({ totalCheckIns })
}
