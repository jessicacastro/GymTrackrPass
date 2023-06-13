import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  execute = async ({
    name,
    email,
    password,
  }: RegisterUseCaseRequest) => {
    const password_hash = await hash(password, 6)
  
    const userAlreadyExistsWithThisEmail = await this.usersRepository.findByEmail(email)
    
    if (userAlreadyExistsWithThisEmail) throw new Error('Email already exists')
  
    const user = await this.usersRepository.create({ name, email, password_hash })
  
    return user
  }
}
