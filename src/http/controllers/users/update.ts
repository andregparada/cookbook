import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { makeUpdateUserUseCase } from '@/use-cases/factories/make-update-user-use-case'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  const updateBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })

  const { name, email, password } = updateBodySchema.parse(request.body)

  try {
    const updateUseCase = makeUpdateUserUseCase()

    await updateUseCase.execute({ userId: user.id, name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
