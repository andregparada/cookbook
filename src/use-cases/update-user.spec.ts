import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update an user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { updatedUser } = await sut.execute({
      userId: user.id,
      name: 'Jane Doe',
    })

    expect(updatedUser.id).toEqual(expect.any(String))
    expect(updatedUser).toEqual(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'johndoe@example.com',
      }),
    )
  })

  it('should not be able to update email to a existing one', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    const user = await usersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        email,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
