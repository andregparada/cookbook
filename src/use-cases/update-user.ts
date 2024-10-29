import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  password?: string
}

interface UpdateUserUseCaseResponse {
  updatedUser: User
}

export class UpdateUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    email,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.UsersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const password_hash = password
      ? await hash(password, 6)
      : user.password_hash

    if (email) {
      const userWithSameEmail = await this.UsersRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.email !== user.email) {
        throw new UserAlreadyExistsError()
      }
    }

    const updatedUser = await this.UsersRepository.update({
      id: userId,
      name: name || user.name,
      email: email || user.email,
      password_hash: password_hash || user.password_hash,
    })

    return {
      updatedUser,
    }
  }
}
