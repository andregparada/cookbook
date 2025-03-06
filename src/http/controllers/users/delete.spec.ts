import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Delete User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete user profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .delete('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
      })

    console.log('Response status:', response.statusCode)
    console.log('Response body:', response.body)

    expect(response.statusCode).toEqual(204)
  })
})
