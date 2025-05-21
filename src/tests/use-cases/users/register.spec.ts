import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { makeUser } from '@/utils/test/factories/make-user'
import { RegisterUseCase } from '@/use-cases/users/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const userData = makeUser()

    const { user } = await sut.execute({
      ...userData,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.id.length).toBeGreaterThan(0)
    expect(user).toMatchObject({
      userName: userData.userName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      isActive: true,
    })
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it('should hash user password upon registration', async () => {
    const userData = makeUser()
    const password = '123456'

    const { user } = await sut.execute({
      ...userData,
      password,
    })

    expect(user.passwordHash).toEqual(expect.any(String))
    expect(user.passwordHash.length).toBeGreaterThan(0)
    expect(user.passwordHash).not.toBe(password)

    const isPasswordCorrectlyHashed = await compare(password, user.passwordHash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email or username twice', async () => {
    const userData = makeUser()

    const registerData = {
      ...userData,
      password: '123456',
    }

    await sut.execute(registerData)

    await expect(sut.execute(registerData)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
