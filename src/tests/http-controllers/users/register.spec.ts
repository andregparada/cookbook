import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createUserData } from '@/utils/test/factories/user-data'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const userData = createUserData()

    const response = await request(app.server)
      .post('/users')
      .send({
        ...userData,
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
  })
})
