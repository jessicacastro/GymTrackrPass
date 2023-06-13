import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

describe('RegisterUseCase', () => {
  it('should hash user password upon registration', async () => {
    const userRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositoryInMemory)
    
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register a new user with an email that is already in use', async () => {
    const userRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositoryInMemory)
    const email = 'johndoe@example.com'

    const registerUseCaseFn = () => registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await registerUseCaseFn()

    await expect(() => registerUseCaseFn()).rejects.toBeInstanceOf(Error)
  })

  it('should be able to register a new user', async () => {
    const userRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositoryInMemory)
    
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
    expect(user.id).toEqual('user-1')
  })
})