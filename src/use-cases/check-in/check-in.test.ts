import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'


import { Decimal } from '@prisma/client/runtime'

import { InMemoryCheckInsRepository, InMemoryGymsRepository } from '@/repositories/in-memory'
import { MaxDistanceError, MaxNumberOfCheckInsError } from '../errors'

import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const createGym = (lat?: string, lng?: string, id?: string) => (
  gymsRepository.create({
    id: id ?? 'gym-1',
    name: 'Javascript Gym',
    description: 'The best gym to learn Javascript',
    phone: '21999999999',
    lat: lat ? lat : -22.7020675,
    long: lng ? lng : -43.2766976,
    created_at: new Date(),
    updated_at: new Date()
  })
)
  


describe('CheckInUseCase', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    createGym()

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a check-in', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    expect(checkIn.id).toBeTypeOf('string')
  })

  it('should not create a two check-ins for the same user in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    const checkInUseCaseFn = () => sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    await expect(() => checkInUseCaseFn()).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to create a check-in for the same user on different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    expect(checkIn.id).toBeTypeOf('string')
  })

  it('should not create a check-in if the user is more than 100 meters from the gym', async () => {
    createGym('-22.6547092', '-43.2563557', 'gym-2')

    const checkInUseCaseCreateFn = () => sut.execute({
      gymId: 'gym-2',
      userId: 'user-1',
      userLat: new Decimal(-22.7020675),
      userLng: new Decimal(-43.2766976)
    })

    await expect(() => checkInUseCaseCreateFn()).rejects.toBeInstanceOf(MaxDistanceError)
  })
})