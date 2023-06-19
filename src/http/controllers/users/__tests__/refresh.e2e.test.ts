import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("RefreshController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678'
    })

    const authResponse = await request(app.server).post('/users/session').send({
      email: 'johndoe@email.com',
      password: '12345678'
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server).patch('/users/token/refresh').set('Cookie', cookies).send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ token: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  })
})