import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { update } from './update'
import { deleteUser } from './delete'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.put('/me', { onRequest: [verifyJWT] }, update)
  app.delete('/me', { onRequest: [verifyJWT] }, deleteUser)
}
