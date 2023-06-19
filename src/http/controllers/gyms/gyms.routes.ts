import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { nearby } from "./nearby";
import { search } from "./search";

export const gymRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/search', search)
  app.get('/nearby', nearby)
  app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, create)
}