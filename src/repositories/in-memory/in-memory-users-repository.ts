import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? 'MEMBER',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isActive: true,
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
      firstName:
        typeof data.firstName === 'string' ? data.firstName : user?.firstName,
      lastName:
        typeof data.lastName === 'string' ? data.lastName : user?.lastName,
      userName:
        typeof data.userName === 'string' ? data.userName : user?.userName,
      email: typeof data.email === 'string' ? data.email : user?.email,
      passwordHash:
        typeof data.passwordHash === 'string'
          ? data.passwordHash
          : user?.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: new Date(),
      deletedAt: null,
      isActive: true,
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

  async findByUserName(userName: string) {
    const user = this.items.find((item) => item.userName === userName)

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
