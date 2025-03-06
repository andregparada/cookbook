import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createUserData } from '@/utils/test/factories/user-data'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const userData = createUserData()

    await request(app.server)
      .post('/users')
      .send({
        ...userData,
        password: '123456',
      })

    const response = await request(app.server).post('/sessions').send({
      email: userData.email,
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
