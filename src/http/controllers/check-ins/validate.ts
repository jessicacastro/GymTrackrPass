import { makeValidateCheckInUseCase } from '@/use-cases/factories'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export const validate = async (request: FastifyRequest, reply: FastifyReply) => {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid()
  })

  const { checkInId } = validateCheckInsParamsSchema.parse(request.params)
  
  const { validateCheckInUseCase } = makeValidateCheckInUseCase()
    
  const { checkIn } = await validateCheckInUseCase.execute({ checkInId })

  return reply.status(204).send({ checkIn })
}
