import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateUser = async (app: FastifyInstance, isAdmin = false) => {
 const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('12345678', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    }
 })

  const authResponse = await request(app.server).post('/users/session').send({
    email: 'johndoe@email.com',
    password: '12345678'
  })

  const { token } = authResponse.body

  return { token }
}