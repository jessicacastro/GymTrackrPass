import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { name, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)
  
  const { createGymUseCase } = makeCreateGymUseCase()
    
  const { gym } = await createGymUseCase.execute({ name, description, phone, lat: latitude, long: longitude })

  return reply.status(201).send({ gym })
}
