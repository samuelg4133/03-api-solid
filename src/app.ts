import { env } from '@env'
import fastifyJwt from '@fastify/jwt'
import { checkInsRoutes } from '@http/controllers/check-ins/routes'
import { gymsRoutes } from '@http/controllers/gyms/routes'
import { userRoutes } from '@http/controllers/users/routes'
import fastify from 'fastify'
import { ZodError } from 'zod'

export const app = fastify({
  logger: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((err, _, res) => {
  if (err instanceof ZodError) {
    return res.status(401).send({
      message: 'Validation Error',
      issues: err.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err)
  }

  return res.status(500).send({
    message: 'Internal server error',
  })
})
