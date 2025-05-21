import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { makeUser } from '@/utils/test/factories/make-user'
import { UpdateUserUseCase } from '@/use-cases/users/update'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update an user', async () => {
    const userData = makeUser()

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
    const firstUserData = makeUser()
    const secondUserData = makeUser()

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
    const firstUserData = makeUser()
    const secondUserData = makeUser()

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
