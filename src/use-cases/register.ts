import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

const prismaUsersRepository = new PrismaUsersRepository()

export const registerUseCase = async ({
  name,
  email,
  password,
}: RegisterUseCaseRequest) => {
  const passwordHash = await hash(password, 6)

  const userAlreadyExistsWithThisEmail = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  
  if (userAlreadyExistsWithThisEmail) throw new Error('Email already exists')

  const user = await prismaUsersRepository.create({ name, email, password_hash: passwordHash })

  return user
}
