import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory'
import { SearchGymsUseCase } from './search-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('SearchGymsUseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should fetch a paginated user check-in history ', async () => {
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
      lat: -22.7020675,
      long: -43.2766976
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1
    })
    

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Javascript Gym' }),
    ])
  })

  it('should fetch a paginated gym search', async () => {
    for(let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        name:  `Javascript Gym ${i}`,
        description: 'The best gym to learn Javascript',
        phone: '123456789',
        lat: -22.7020675,
        long: -43.2766976
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Javascript Gym 21' }),
      expect.objectContaining({ name: 'Javascript Gym 22' }),
    ])
  })

  it('should return an empty array if there are no gyms with the search filters', async () => {
    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1
    })
    

    expect(gyms).toHaveLength(0)
  })
})