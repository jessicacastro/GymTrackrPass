import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUsersCheckInsHistoryUseCase } from './fetch-user-check-ins-history'


let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUsersCheckInsHistoryUseCase

describe('FetchUserCheckInsUseCase', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUsersCheckInsHistoryUseCase(checkInRepository)
  })

  it('should fetch a paginated user check-in history ', async () => {
    for(let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-1',
      })
    }
    
    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' })
    ])
  })

  it('should return an empty array if user has no check-ins', async () => {
    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1
    })

    expect(checkIns).toHaveLength(0)
  })
})