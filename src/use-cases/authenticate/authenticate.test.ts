import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

import { AuthenticateUseCase } from './authenticate'

describe('AuthenticateUseCase', () => {
  it('should authenticate a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.id).toEqual('user-1')
  })

  it('should not authenticate a user with the wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const authenticateUseCaseFn = () => sut.execute({
      email: 'johndoes@example.com',
      password: '123456'
    })

    await expect(() => authenticateUseCaseFn()).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate a user with the wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const authenticateUseCaseFn = () => sut.execute({
      email: 'johndoe@example.com',
      password: '12345'
    })

    await expect(() => authenticateUseCaseFn()).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})