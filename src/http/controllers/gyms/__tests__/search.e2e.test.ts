import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";


import { app } from "@/app";

describe("SearchGymController E2E", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search gyms by name", async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post("/gyms").set({
      Authorization: `Bearer ${token}`
    }).send({
      name: "Javascript Gym",
      description: "Some description",
      phone: "21999999999",
      latitude: -22.7020675,
      longitude: -43.2766976
    })

    await request(app.server).post("/gyms").set({
      Authorization: `Bearer ${token}`
    }).send({
      name: "Typescript Gym",
      description: "Some description",
      phone: "21999999999",
      latitude: -22.7020675,
      longitude: -43.2766976
    })

    const response = await request(app.server).get("/gyms/search")
    .query({
      query: "Javascript"
    })
    .set({
      Authorization: `Bearer ${token}`
    }).send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: "Javascript Gym"
      })
    ])
  })
})