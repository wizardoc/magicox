import { Middleware, Context, Next } from 'koa'
import { logger } from '@magicox/lib'

export const LoggerMiddleware: Middleware = async (
  ctx: Context,
  next: Next
) => {
  await next()

  logger.request(ctx.method, ctx.status, ctx.hostname, ctx.path)
}
