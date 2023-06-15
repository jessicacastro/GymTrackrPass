
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  totalCheckIns: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsrepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const totalCheckIns = await this.checkInsrepository.getTotalCheckInsCountByUserId(userId)

    return {
      totalCheckIns
    }
  }
}