import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

const PrismaService = new PrismaClient()

PrismaService.user.create({
  data: {
    email: 'diego@email.com',
    name: 'Diego Fernandes',
  },
})
