import { GymsRepository } from '@repositories/gyms-repository'
import { InMemoryGymsRepository } from '@repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@use-cases/create-gym'
import { beforeEach, describe, expect, it } from 'vitest'

let gymsRepository: GymsRepository
let sut: CreateGymUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      description: 'Teste',
      latitude: 10,
      longitude: -10,
      phone: '99999999',
      title: 'JS Gym',
    })

    expect(gym).toBeDefined()
  })
})
