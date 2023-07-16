import { UseCase } from '@core'
import { User } from '@prisma/client'
import { UsersRepository } from '@repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase
  implements
    UseCase<GetUserProfileUseCaseRequest, GetUserProfileUseCaseResponse>
{
  public constructor(private usersRepository: UsersRepository) {}

  public async execute(
    request: GetUserProfileUseCaseRequest,
  ): Promise<GetUserProfileUseCaseResponse> {
    const { userId } = request
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
