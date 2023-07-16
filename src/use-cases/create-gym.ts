import { UseCase } from '@core'
import { Gym } from '@prisma/client'
import { GymsRepository } from '@repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  description: string | null
  latitude: number
  longitude: number
  phone: string | null
  title: string
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase
  implements UseCase<CreateGymUseCaseRequest, CreateGymUseCaseResponse>
{
  public constructor(private readonly gymsRepository: GymsRepository) {}

  public async execute(
    request: CreateGymUseCaseRequest,
  ): Promise<CreateGymUseCaseResponse> {
    const { description, title, latitude, longitude, phone } = request

    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    })

    return { gym }
  }
}
