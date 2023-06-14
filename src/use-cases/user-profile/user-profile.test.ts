import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserProfileUseCase } from './user-profile'

let usersRepository: InMemoryUsersRepository
let sut: UserProfileUseCase

describe('UserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserProfileUseCase(usersRepository)
  })

  it('should get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(createdUser.id)
    expect(user.name).toEqual('John Doe')
  })

  it('should not get a user profile with the wrong id', async () => {
    const useProfileUseCaseFn = () => sut.execute({
      userId: 'non-existing-id'
    })

    expect(() => useProfileUseCaseFn()).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})