import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("CreateGymController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it("should be able to create a new gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server).post("/gyms").set({
      Authorization: `Bearer ${token}`
    }).send({
      name: "Javascript Gym",
      description: "Some description",
      phone: "21999999999",
      latitude: -22.7020675,
      longitude: -43.2766976
    })

    expect(response.statusCode).toBe(201)
  })
})