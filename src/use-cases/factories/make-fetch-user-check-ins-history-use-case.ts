import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history/fetch-user-check-ins-history";

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const checkInsrepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInsrepository);


  return { fetchUserCheckInsHistoryUseCase };
}