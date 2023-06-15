import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('FetchNearbyGymsUseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should fetch nearby gyms', async () => {
    await gymsRepository.create({
      name: 'Javascript Gym',
      description: 'The best gym to learn Javascript',
      phone: '123456789',
      lat: -22.7020675,
      long: -43.2766976
    })

    await gymsRepository.create({
      name: 'Typescript Gym',
      description: 'The best gym to learn Typescript',
      phone: '123456789',
      lat: -22.9843865, // 30km away from the user
      long: -43.1979745 // 30km away from the user
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.7020675,
      userLongitude: -43.2766976
    })
    

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Javascript Gym' }),
    ])
  })

  it('should return an empty array if there are no gyms with the search filters', async () => {
    const { gyms } = await sut.execute({
      userLatitude: -22.7020675,
      userLongitude: -43.2766976
    })
    

    expect(gyms).toHaveLength(0)
  })
})