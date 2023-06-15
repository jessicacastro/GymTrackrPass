import { CheckIn } from "@prisma/client";

import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsrepository: CheckInsRepository) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsrepository.findManyByUserId(userId, page)

    return {
      checkIns
    }
  }
}