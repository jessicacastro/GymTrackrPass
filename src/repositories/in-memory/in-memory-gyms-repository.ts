import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find(gym => gym.id === id);

    return gym || null;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      phone: data.phone ?? null,
      description: data.description ?? null,
      lat: new Prisma.Decimal(data.lat.toString()),
      long: new Prisma.Decimal(data.long.toString()),
      created_at: new Date(),
      updated_at: new Date()
    }

    this.gyms.push(gym);

    return gym;
  }

}