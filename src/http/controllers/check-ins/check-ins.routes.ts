import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";

export const checkInRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/history', history)
  app.get('/metrics', metrics)
  app.post("/gyms/:gymId/check-ins", create)
  app.patch("/:checkInId/validate", validate)
}