import { Optional } from '@core'
import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class GymsRepository {
  abstract create(data: Prisma.GymCreateInput): Promise<Gym>
  abstract findById(id: string): Promise<Optional<Gym>>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  abstract searchMany(query: string, page: number): Promise<Gym[]>
}
