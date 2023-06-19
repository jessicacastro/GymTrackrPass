import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";


import { app } from "@/app";

describe("NearbyGymController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server).post("/gyms").set({
      Authorization: `Bearer ${token}`
    }).send({
      name: "Nearby Gym",
      description: "Some description",
      phone: "21999999999",
      latitude: -22.7020675,
      longitude: -43.2766976
    })

    await request(app.server).post("/gyms").set({
      Authorization: `Bearer ${token}`
    }).send({
      name: "Far Gym",
      description: "Some description",
      phone: "21999999999",
      latitude: -22.9843865, // 30km away from the user
      longitude: -43.1979745
    })

    const response = await request(app.server).get("/gyms/nearby")
    .query({
      latitude: -22.7020675,
      longitude: -43.2766976
    })
    .set({
      Authorization: `Bearer ${token}`
    }).send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: "Nearby Gym"
      })
    ])
  })
})