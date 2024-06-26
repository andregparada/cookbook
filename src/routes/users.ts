import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    const hashedPassword = await hash(password, 6)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      hashed_password: hashedPassword,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  // TODO atualizar com autenticação e login

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const updatedUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { name, email, password } = updatedUserBodySchema.parse(
        request.body,
      )

      const hashedPassword = await hash(password, 6)

      const user = await knex('users').where({ id }).first()

      if (!user) {
        return reply.status(404).send({ error: 'User not found' })
      }

      await knex('users').where({ id }).update({
        name,
        email,
        hashed_password: hashedPassword,
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      await knex('users').where({ id }).delete()

      return reply.status(201).send()
    },
  )
}
