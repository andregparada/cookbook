import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    firstName,
    lastName,
    userName,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    const userWithSameUserName =
      await this.usersRepository.findByUserName(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    if (userWithSameUserName) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      firstName,
      lastName,
      userName,
      email,
      passwordHash,
    })

    return { user }
  }
}
