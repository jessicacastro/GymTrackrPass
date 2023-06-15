import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins-repository'


export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data
    })

    return checkIn
  }

  
  findById(id: string): Promise<CheckIn | null> {
    const checkIn = prisma.checkIn.findUnique({
      where: {
        id
      }
    })

    return checkIn
  }

  save(checkIn: CheckIn): Promise<CheckIn> {
    const savedCheckIn = prisma.checkIn.update({
      where: {
        id: checkIn.id
      },
      data: checkIn
    })

    return savedCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('day')
    const endOfTheDay = dayjs(date).endOf('day')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate()
        }
      }
    })
    
    return checkIn
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      take: 20, // 20 is the default page size
      skip: (page - 1) * 20, // jump 20 records for each page
    })

    return checkIns
  }

  getTotalCheckInsCountByUserId(userId: string): Promise<number> {
    const totalCheckInsCount = prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return totalCheckInsCount
  }



}
