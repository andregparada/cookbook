import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { registerRandomUser } from '@/utils/test/factories/register-user'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const userData = registerRandomUser()

    const { user } = await sut.execute(userData)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userData = registerRandomUser()

    const { user } = await sut.execute(userData)

    const isPasswordCorrectlyHashed = await compare(
      userData.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userData = registerRandomUser()

    await sut.execute(userData)

    await expect(() => sut.execute(userData)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
