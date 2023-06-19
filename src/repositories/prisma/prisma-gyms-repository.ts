import { Gym } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
  async create(data: any): Promise<Gym> {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        },
      },
      take: 20, // 20 is the default page size
      skip: (page - 1) * 20, // jump 20 records for each page
    })

    return gyms
  }

  async findManyNearby(params: any): Promise<Gym[]> {
    const { latitude, longitude } = params

    // get gyms within 10km of the user
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE (6371e3 * acos( cos( radians(${latitude}) ) * cos( radians( lat ) ) 
        * cos( radians( long ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
        * sin( radians( lat ) ) ) ) <= 10000
    `

    return gyms
  }
}