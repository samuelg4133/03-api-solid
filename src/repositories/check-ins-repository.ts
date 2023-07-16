import { Optional } from '@core'
import { CheckIn, Prisma } from '@prisma/client'

export abstract class CheckInsRepository {
  abstract countByUserId(userId: string): Promise<number>
  abstract create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  abstract findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<Optional<CheckIn>>

  abstract findById(id: string): Promise<CheckIn | null>

  abstract findManyByUserId(
    userId: string,
    page: number
  ): Promise<Array<CheckIn>>

  abstract save(checkIn: CheckIn): Promise<CheckIn>
}
