import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserMetricsUseCase } from "../get-user-metrics/get-user-metrics";

export const makeGetUserMetricsUseCase = () => {
  const checkInsrepository = new PrismaCheckInsRepository();
  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsrepository);


  return { getUserMetricsUseCase };
}