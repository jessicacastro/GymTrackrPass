import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('CreateGymUseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      name: 'Javascript Gym',
      description: 'The best gym to learn Javascript',
      phone: '123456789',
      lat: -22.7020675,
      long: -43.2766976
    })

    expect(gym.id).toBeTypeOf('string')
  })
})