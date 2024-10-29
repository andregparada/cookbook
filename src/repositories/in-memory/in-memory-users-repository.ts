import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? 'MEMBER',
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async update(data: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === data.id)
    const user = this.items[userIndex]

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const updatedUser = {
      id: user.id,
      name: typeof data.name === 'string' ? data.name : user?.name,
      email: typeof data.email === 'string' ? data.email : user?.email,
      password_hash:
        typeof data.password_hash === 'string'
          ? data.password_hash
          : user?.password_hash,
      role: user.role,
      created_at: user.created_at,
    }

    this.items[userIndex] = updatedUser

    return updatedUser
  }

  async delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id)
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
