import { CheckIn } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';

import { MaxDistanceError, MaxNumberOfCheckInsError, ResourceNotFoundError } from '../errors';

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
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const gymCoordinates = { latitude: gym.lat.toNumber(), longitude: gym.long.toNumber() }
    const userCoordinates = { latitude: userLat.toNumber(), longitude: userLng.toNumber() }

    const distance = getDistanceBetweenCoordinates(gymCoordinates, userCoordinates)

    if (distance > MAX_DISTANCE_IN_METERS) throw new MaxDistanceError()
    
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDate) throw new MaxNumberOfCheckInsError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })
  
    return { checkIn }
  }
}
