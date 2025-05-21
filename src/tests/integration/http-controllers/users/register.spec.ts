import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { makeUser } from '@/utils/test/factories/make-user'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const user = makeUser()

    const response = await request(app.server)
      .post('/users')
      .send({
        ...user,
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
  })
})
