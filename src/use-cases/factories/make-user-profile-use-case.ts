import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserProfileUseCase } from "../user-profile/user-profile";

export const makeUserProfileUseCase = () => {
  const usersRepository = new PrismaUsersRepository();
  const userProfileUseCase = new UserProfileUseCase(usersRepository);


  return { userProfileUseCase };
}