import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserUseCase } from '../update-user'

export function makeUpdateOrgUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new UpdateUserUseCase(userRepository)

  return useCase
}
