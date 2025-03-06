import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { createUserData } from '@/utils/test/factories/user-data'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update an user', async () => {
    const userData = createUserData()

    const user = await usersRepository.create(userData)

    const { updatedUser } = await sut.execute({
      userId: user.id,
      userName: 'Jane Doe',
    })

    expect(updatedUser.id).toEqual(expect.any(String))
    expect(updatedUser).toEqual(
      expect.objectContaining({
        userName: 'Jane Doe',
        email: userData.email,
      }),
    )
  })

  it('should not be able to update email to a existing one', async () => {
    const firstUserData = createUserData()
    const secondUserData = createUserData()

    await usersRepository.create(firstUserData)
    const secondUser = await usersRepository.create(secondUserData)

    await expect(() =>
      sut.execute({
        userId: secondUser.id,
        email: firstUserData.email,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to update username to a existing one', async () => {
    const firstUserData = createUserData()
    const secondUserData = createUserData()

    await usersRepository.create(firstUserData)
    const secondUser = await usersRepository.create(secondUserData)

    await expect(() =>
      sut.execute({
        userId: secondUser.id,
        userName: firstUserData.userName,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
