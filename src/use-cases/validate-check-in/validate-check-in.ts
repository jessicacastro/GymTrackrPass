import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from '../errors';



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

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)
  
    return { checkIn }
  }
}
