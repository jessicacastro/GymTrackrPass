import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory'
import { GetUserMetricsUseCase } from './get-user-metrics'


let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('GetUserMetricsUseCase', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should return the total check-ins of a user from metrics', async () => {
    for(let i = 1; i <= 2; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-1',
      })
    }
    
    const { totalCheckIns } = await sut.execute({
      userId: 'user-1',
    })

    expect(totalCheckIns).toEqual(2)
  })

  it('should return 0 if user has no check-ins', async () => {
    const { totalCheckIns } = await sut.execute({
      userId: 'user-1',
    })

    expect(totalCheckIns).toEqual(0)
  })
})