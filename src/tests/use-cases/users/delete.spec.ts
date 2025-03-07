import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createUserData } from '@/utils/test/factories/user-data'
import { DeleteUserUseCase } from '@/use-cases/users/delete'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able to delete an user', async () => {
    const userData = createUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({ userId: user.id })

    const deletedUser = await usersRepository.findById(user.id)

    await expect(deletedUser).toBeNull()
  })

  it('should not be able to delete user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
