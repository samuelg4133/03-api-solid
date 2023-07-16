import { CheckInsRepository } from '@repositories/check-ins-repository'
import { GymsRepository } from '@repositories/gyms-repository'
import { InMemoryCheckInsRepository } from '@repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from '@use-cases/check-in'
import { MaxDistanceError } from '@use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@use-cases/errors/max-number-of-check-ins-error'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let checkInsRepository: CheckInsRepository
let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { id } = await gymsRepository.create({
      id: randomUUID(),
      title: 'JavaScript Gym',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: id,
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toBeDefined()
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const userId = randomUUID()

    const { id: gymId } = await gymsRepository.create({
      id: randomUUID(),
      title: 'JavaScript Gym',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    await sut.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const userId = randomUUID()

    const { id: gymId } = await gymsRepository.create({
      id: randomUUID(),
      title: 'JavaScript Gym',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    await sut.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId,
      gymId,
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toBeDefined()
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const userId = randomUUID()

    const { id: gymId } = await gymsRepository.create({
      id: randomUUID(),
      title: 'JavaScript Gym',
      description: '',
      latitude: -17.3127699,
      longitude: -44.2313466,
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId,
        userLatitude: -17.37783,
        userLongitude: -44.96782,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
