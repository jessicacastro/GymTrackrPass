import { makeCheckInUseCase } from '@/use-cases/factories'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid()
  })
  
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const userId: string = request.user.sub

  const { gymId } = createCheckInsParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  
  const { checkInUseCase } = makeCheckInUseCase()
    
  const { checkIn } = await checkInUseCase.execute({ gymId, userId, userLat: latitude, userLng: longitude })

  return reply.status(200).send({ checkIn })
}
