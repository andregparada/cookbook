import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { createUserData } from '@/utils/test/factories/user-data'
import { faker } from '@faker-js/faker'
import { AuthenticateUseCase } from '@/use-cases/users/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const userData = createUserData()

    await usersRepository.create({
      ...userData,
      passwordHash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: userData.email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user).toBeDefined()
  })

  it('should not be able to authenticate with wrong e-mail', async () => {
    await expect(() =>
      sut.execute({
        email: faker.internet.email(),
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userData = createUserData()

    await usersRepository.create(userData)

    await expect(() =>
      sut.execute({
        email: userData.email,
        password: '000000',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
