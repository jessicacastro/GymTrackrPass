import { InMemoryCheckInsRepository } from "@/repositories/in-memory";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceNotFoundError } from "../errors";
import { MaxTimeLimitToCheckInError } from "../errors/max-time-limit-to-check-in-error";
import { ValidateCheckInUseCase } from "./validate-check-in";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('ValidateCheckInUseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should validate a check-in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })

    const { checkIn: validatedCheckIn } = await sut.execute({
      checkInId: checkIn.id
    })

    expect(validatedCheckIn.validated_at).toBeInstanceOf(Date)
    expect(checkInsRepository.checkIns[0].validated_at).toBeInstanceOf(Date)
  })

  it('should not validate a inexistent check-in', async () => {
    await expect(sut.execute({
      checkInId: 'inexistent-check-in'
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not validate a check-in twice', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })

    await sut.execute({
      checkInId: checkIn.id
    })

    await expect(sut.execute({
      checkInId: checkIn.id
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not validate a check-in if it was created more than 20 minutes ago', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })

    const twentyOneMinutesInMs = 21 * 60 * 1000

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    const validateCheckInUseCaseFn = () => sut.execute({
      checkInId: checkIn.id
    })

    await expect(() => validateCheckInUseCaseFn()).rejects.toBeInstanceOf(MaxTimeLimitToCheckInError)
  })
})