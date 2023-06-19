import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymsUseCase } from '@/use-cases/factories'

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymQuerySchema = z.object({
    query: z.string().min(3),
    page: z.coerce.number().min(1).default(1)
  })

  const { query, page } = searchGymQuerySchema.parse(request.query)
  
  const { searchGymsUseCase } = makeSearchGymsUseCase()
    
  const { gyms } = await searchGymsUseCase.execute({ query, page })

  return reply.status(200).send({ gyms })
}
