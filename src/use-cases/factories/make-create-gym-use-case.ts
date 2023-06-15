import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym/create-gym";

export const makeCreateGymUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);


  return { createGymUseCase };
}