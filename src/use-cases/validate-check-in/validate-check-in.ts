import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { ResourceNotFoundError } from '../errors';
import { MaxTimeLimitToCheckInError } from '../errors/max-time-limit-to-check-in-error';



interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE_IN_METERS = 100

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) {}

  execute = async ({
    checkInId
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> => {
   const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    if (checkIn.validated_at) throw new ResourceNotFoundError()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minute')

    if (distanceInMinutesFromCheckInCreation > 20) throw new MaxTimeLimitToCheckInError()

    checkIn.validated_at =  new Date()

    await this.checkInsRepository.save(checkIn)
  
    return { checkIn }
  }
}
