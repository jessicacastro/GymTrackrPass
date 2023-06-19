import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("ValidateCheckInController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it("should be able to validate a check-in", async () => {
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

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id
      }
    })


    const response = await request(app.server).patch(`/check-ins/${checkIn.id}/validate`).set({
      Authorization: `Bearer ${token}`
    }).send()

    checkIn = await prisma.checkIn.findFirstOrThrow({})


    expect(response.statusCode).toBe(200)
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})