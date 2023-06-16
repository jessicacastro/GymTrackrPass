import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("AuthenticateController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678'
    })

    const authResponse = await request(app.server).post('/users/session').send({
      email: 'johndoe@email.com',
      password: '12345678'
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server).get('/me').set({
      Authorization: `Bearer ${token}`
    }).send()

    expect(profileResponse.statusCode).toBe(200)
    expect(profileResponse.body.user).toEqual(expect.objectContaining({
      email: 'johndoe@email.com'
    }))
  })
})