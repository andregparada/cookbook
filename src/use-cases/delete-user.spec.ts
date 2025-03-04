import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'
import { randomUserData } from '@/utils/test/factories/user'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able to delete an user', async () => {
    const userData = randomUserData()

    const user = await usersRepository.create(userData)

    await sut.execute({ userId: user.id })

    const deletedUser = await usersRepository.findById(user.id)

    await expect(deletedUser).toBeNull()
  })
})
