import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("CreateCheckInController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        name: "Javascript Gym",
        description: "Some description",
        phone: "21999999999",
        lat: -22.7020675,
        long: -43.2766976
      }
    })

    const response = await request(app.server).post(`/check-ins/gyms/${gym.id}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      latitude: -22.7020675,
      longitude: -43.2766976
    })

    expect(response.statusCode).toBe(201)
  })
})