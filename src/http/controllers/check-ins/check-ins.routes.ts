import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";

export const checkInRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/history', history)
  app.get('/metrics', metrics)
  app.post("/gyms/:gymId", create)
  app.patch("/:checkInId/validate", { onRequest: [verifyUserRole('ADMIN')] }, validate)
}