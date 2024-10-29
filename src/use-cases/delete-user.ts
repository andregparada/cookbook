import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteOrgUseCaseRequest {
  userId: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteOrgUseCaseRequest) {
    const org = await this.usersRepository.findById(userId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
