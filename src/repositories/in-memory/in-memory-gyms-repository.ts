import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { GymsRepository } from "../gyms-repository";

const MAX_DISTANTE_IN_METERS = 10000

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

  async searchMany(query: string, page: number) {
    const gyms = 
      this.gyms.filter(gym => gym.name
        .includes(query))
        .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async findManyNearby(params: { latitude: number; longitude: number; }) {
    const gyms = this.gyms.filter(gym => {
      const gymCoordinates = {
        latitude: gym.lat.toNumber(),
        longitude: gym.long.toNumber()
      }

      const userCoordinates = {
        latitude: params.latitude,
        longitude: params.longitude
      }


      const distance = getDistanceBetweenCoordinates(gymCoordinates, userCoordinates);

      return distance <= MAX_DISTANTE_IN_METERS;
    });

    return gyms;
  }

}