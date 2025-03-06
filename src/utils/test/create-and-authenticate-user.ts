import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { createUserData } from './factories/user-data'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const userData = createUserData()

  await prisma.user.create({
    data: {
      ...userData,
      passwordHash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: userData.email,
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
    email: userData.email,
  }
}
