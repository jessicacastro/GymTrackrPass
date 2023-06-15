import { InMemoryCheckInsRepository } from "@/repositories/in-memory";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceNotFoundError } from "../errors";
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
})