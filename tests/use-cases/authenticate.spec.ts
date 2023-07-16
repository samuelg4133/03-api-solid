import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@repositories/users-repository'
import { AuthenticateUseCase } from '@use-cases/authenticate'
import { InvalidCredentialsError } from '@use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: UsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'johndoe@test.com'
    const password = '123456'
    const password_hash = await hash(password, 6)

    await usersRepository.create({
      email,
      password_hash,
      name: 'John Doe',
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user).toBeDefined()
  })

  it('should not be able to authenticate with wrong email', async () => {
    const email = 'johndoe@test.com'
    const password = '123456'

    await expect(() =>
      sut.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'johndoe@test.com'
    const password = '123456'

    const password_hash = await hash(password, 6)

    await usersRepository.create({
      email,
      password_hash,
      name: 'John Doe',
    })

    await expect(() =>
      sut.execute({
        email,
        password: '123456778',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
