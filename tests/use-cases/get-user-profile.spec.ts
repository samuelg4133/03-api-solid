import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@repositories/users-repository'
import { GetUserProfileUseCase } from '@use-cases/get-user-profile'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './../../src/use-cases/errors/resource-not-found-error'

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get a user profile', async () => {
    const email = 'johndoe@test.com'
    const password = '123456'
    const password_hash = await hash(password, 6)

    const { id: userId } = await usersRepository.create({
      email,
      password_hash,
      name: 'John Doe',
    })

    const { user } = await sut.execute({
      userId,
    })

    expect(user).toBeDefined()
  })

  it('should not be able to get a user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
