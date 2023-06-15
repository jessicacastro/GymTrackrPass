import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    throw new Error("Method not implemented.");
  }
}