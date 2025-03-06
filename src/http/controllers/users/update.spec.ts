import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { faker } from '@faker-js/faker'

describe('Update User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update user profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .put('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
        firstName: faker.person.firstName(),
      })

    expect(response.statusCode).toEqual(200)
  })
})
