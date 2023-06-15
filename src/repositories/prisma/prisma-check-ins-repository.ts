import { CheckIn, Prisma } from '@prisma/client'


import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins-repository'


export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    throw new Error('Method not implemented.')
  }
}
