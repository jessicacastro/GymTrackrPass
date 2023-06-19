import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("HistoryCheckInController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it("should be able to list the history of check-ins", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: "Javascript Gym",
        description: "Some description",
        phone: "21999999999",
        lat: -22.7020675,
        long: -43.2766976
      }
    })

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id
        },
        {
          user_id: user.id,
          gym_id: gym.id
        },
      ]
    })

    const response = await request(app.server).get('/check-ins/history').set({
      Authorization: `Bearer ${token}`
    }).send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkIns).toHaveLength(2)
    expect(response.body.checkIns).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        gym_id: gym.id,
      })
    ]))
  })
})