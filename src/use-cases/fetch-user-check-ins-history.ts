import { UseCase } from '@core'
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  page: number
  userId: string
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase
  implements
    UseCase<
      FetchUserCheckInsHistoryUseCaseRequest,
      FetchUserCheckInsHistoryUseCaseResponse
    >
{
  public constructor(private readonly checkInsRepository: CheckInsRepository) {}

  public async execute(
    request: FetchUserCheckInsHistoryUseCaseRequest,
  ): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const { userId, page } = request

    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
