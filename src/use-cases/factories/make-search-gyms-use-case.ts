import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsUseCase } from "../search-gyms/search-gyms";

export const makeSearchGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);


  return { searchGymsUseCase };
}