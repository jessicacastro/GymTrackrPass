import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { CheckIn } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLat: Decimal;
  userLng: Decimal;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE_IN_METERS = 100

export class CheckInUseCase {
  constructor( 
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  execute = async ({
    userId,
    gymId,
    userLat,
    userLng
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> => {
    const gyn = await this.gymsRepository.findById(gymId)

    if (!gyn) throw new ResourceNotFoundError()

    const gymCoordinates = { latitude: gyn.lat.toNumber(), longitude: gyn.long.toNumber() }
    const userCoordinates = { latitude: userLat.toNumber(), longitude: userLng.toNumber() }

    const distance = getDistanceBetweenCoordinates(gymCoordinates, userCoordinates)

    if (distance > MAX_DISTANCE_IN_METERS) throw new Error()
    
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDate) throw new Error()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })
  
    return { checkIn }
  }
}
