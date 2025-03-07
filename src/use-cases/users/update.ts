import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface UpdateUserUseCaseRequest {
  userId: string
  firstName?: string
  lastName?: string
  userName?: string
  email?: string
  password?: string
}

interface UpdateUserUseCaseResponse {
  updatedUser: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    firstName,
    lastName,
    userName,
    email,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const passwordHash = password ? await hash(password, 6) : user.passwordHash

    if (email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.email !== user.email) {
        throw new UserAlreadyExistsError()
      }
    }

    if (userName) {
      const userWithSameUserName =
        await this.usersRepository.findByUserName(userName)

      if (
        userWithSameUserName &&
        userWithSameUserName.userName !== user.userName
      ) {
        throw new UserAlreadyExistsError()
      }
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      userName: userName || user.userName,
      email: email || user.email,
      passwordHash: passwordHash || user.passwordHash,
    })

    return {
      updatedUser,
    }
  }
}
