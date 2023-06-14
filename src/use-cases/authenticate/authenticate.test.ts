import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

import { AuthenticateUseCase } from './authenticate'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should authenticate a user', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.id).toEqual(createdUser.id)
  })

  it('should not authenticate a user with the wrong email', async () => {
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