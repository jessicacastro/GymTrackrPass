import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms/fetch-nearby-gyms";

export const makeFetchNearbyGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);


  return { fetchNearbyGymsUseCase };
}