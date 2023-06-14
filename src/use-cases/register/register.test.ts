import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('RegisterUseCase', () => {
  
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register a new user with an email that is already in use', async () => {
    const email = 'johndoe@example.com'

    const registerUseCaseFn = () => sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await registerUseCaseFn()

    await expect(() => registerUseCaseFn()).rejects.toBeInstanceOf(Error)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
    expect(user.id).toBeTypeOf('string')
  })
})