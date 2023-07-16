import { Optional } from '@core'
import { prisma } from '@lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  public async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  public async findByEmail(email: string): Promise<Optional<User>> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  public async findById(id: string): Promise<Optional<User>> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }
}
