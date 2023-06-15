import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../check-in/check-in";

export const makeCheckInUseCase = () => {
  const checkInRepository = new PrismaCheckInsRepository();
  const checkInUseCase = new CheckInUseCase(checkInRepository);


  return { checkInUseCase };
}