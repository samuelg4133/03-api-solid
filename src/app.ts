import { env } from '@env'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { appRoutes } from './http/routes'

export const app = fastify({
  logger: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(appRoutes)

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
