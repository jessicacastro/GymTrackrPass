import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../validate-check-in/validate-check-in";

export const makeValidateCheckInUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);


  return { validateCheckInUseCase };
}