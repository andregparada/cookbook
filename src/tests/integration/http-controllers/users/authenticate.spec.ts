import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeUser } from '@/utils/test/factories/make-user'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const user = makeUser()

    await request(app.server)
      .post('/users')
      .send({
        ...user,
        password: '123456',
      })

    const response = await request(app.server).post('/sessions').send({
      email: user.email,
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
