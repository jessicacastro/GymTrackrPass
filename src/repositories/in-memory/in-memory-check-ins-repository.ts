import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null
    }

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkIns.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    }) 
    
    return checkInOnSameDate || null;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20) // 20 is the limit of check-ins per page

    return checkIns;
  }

  async getTotalCheckInsCountByUserId(userId: string) {
    const totalCheckIns = this.checkIns.filter(checkIn => checkIn.user_id === userId).length

    return totalCheckIns;
  }
}