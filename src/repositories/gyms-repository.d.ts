import { Gym } from "@prisma/client";

export interface GymsRepository {
  findById: (id: string) => Promise<Gym | null>
  create: (data: Omit<Gym, 'id' | 'created_at' | 'updated_at'>) => Promise<Gym>
}