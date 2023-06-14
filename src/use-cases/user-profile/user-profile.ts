import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UserProfileUseCaseRequest {
  userId: string
}

interface UserProfileUseCaseResponse {
  user: User
}

export class UserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  execute = async ({
    userId,
  }: UserProfileUseCaseRequest): Promise<UserProfileUseCaseResponse> => {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()
  
    return { user }
  }
}
