import { hash } from 'bcryptjs'

import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUsersRepository) {}

  execute = async ({
    name,
    email,
    password,
  }: RegisterUseCaseRequest) => {
    const passwordHash = await hash(password, 6)
  
    const userAlreadyExistsWithThisEmail = await this.usersRepository.getUserByEmail(email)
    
    if (userAlreadyExistsWithThisEmail) throw new Error('Email already exists')
  
    const user = await this.usersRepository.create({ name, email, password_hash: passwordHash })
  
    return user
  }
}
