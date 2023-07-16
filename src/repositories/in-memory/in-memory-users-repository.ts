import { Optional } from '@core'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '@repositories/users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  public async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      created_at: new Date(),
      email: data.email,
      id: randomUUID(),
      name: data.name,
      password_hash: data.password_hash,
    }

    this.users.push(user)

    return user
  }

  public async findByEmail(email: string): Promise<Optional<User>> {
    return this.users.find((user) => user.email === email) || null
  }

  public async findById(id: string): Promise<Optional<User>> {
    return this.users.find((user) => user.id === id) || null
  }
}
