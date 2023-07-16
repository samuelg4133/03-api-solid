import { UseCase } from '@core'
import { CheckInsRepository } from '@repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase
  implements
    UseCase<GetUserMetricsUseCaseRequest, GetUserMetricsUseCaseResponse>
{
  public constructor(private readonly checkInsRepository: CheckInsRepository) {}

  public async execute(
    request: GetUserMetricsUseCaseRequest,
  ): Promise<GetUserMetricsUseCaseResponse> {
    const { userId } = request

    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
