import { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { authenticate, profile, register } from ".."

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/', register)
  app.post('/session', authenticate)
  
  /** Authenticated routes */
  app.get('/me', { onRequest: [verifyJWT] } , profile)
}
