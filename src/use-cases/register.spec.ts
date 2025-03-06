import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createUserData } from '@/utils/test/factories/user-data'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const userData = createUserData()

    const { user } = await sut.execute({
      ...userData,
      password: '1233456',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.userName).toEqual(userData.userName)
  })

  it('should hash user password upon registration', async () => {
    const userData = createUserData()

    const password = '123456'

    const { user } = await sut.execute({
      ...userData,
      password,
    })

    const isPasswordCorrectlyHashed = await compare(password, user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email and username twice', async () => {
    const userData = createUserData()

    const registerData = {
      ...userData,
      password: '1233456',
    }

    await sut.execute(registerData)

    await expect(() => sut.execute(registerData)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
