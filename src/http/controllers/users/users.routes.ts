import { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { authenticate, profile, refresh, register } from ".."

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/', register)
  app.post('/session', authenticate)
  app.patch('/token/refresh', refresh)
  
  /** Authenticated routes */
  app.get('/me', { onRequest: [verifyJWT] } , profile)
}
