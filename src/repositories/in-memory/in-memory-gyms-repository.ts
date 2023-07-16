import { Optional } from '@core'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
  FindManyNearbyParams,
  GymsRepository,
} from '@repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@utils/get-distance-between-coordinates'
import { randomUUID } from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  private items: Gym[] = []

  public async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      description: data.description || null,
      id: randomUUID(),
      latitude: new Decimal(data.latitude as number) as Prisma.Decimal,
      longitude: new Decimal(data.longitude as number) as Prisma.Decimal,
      phone: data.phone || null,
      title: data.title,
    }

    this.items.push(gym)

    return gym
  }

  public async findById(id: string): Promise<Optional<Gym>> {
    return this.items.find((item) => item.id === id) || null
  }

  public async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      )

      return distance < 10
    })
  }

  public async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
}
