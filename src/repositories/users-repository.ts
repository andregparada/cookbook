import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  update(data: Prisma.UserUpdateInput): Promise<User>
  delete(id: string): void
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
