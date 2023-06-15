import { GymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface CreateGymUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  lat: number
  long: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  execute = async ({ 
    name, 
    description, 
    phone, 
    lat, 
    long
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> => {
  
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      lat,
      long
    })
  
    return { gym }
  }
}
