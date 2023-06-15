import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in/check-in";

export const makeCheckInUseCase = () => {
  const checkInRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);


  return { checkInUseCase };
}