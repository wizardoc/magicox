import { app } from '../../server/serve-production'
import { logger } from '@magicox/lib'

export function startHandler() {
  // TODO: custom port
  app.listen(8000, () => logger.success('Magicox App is starting!'))
}
