import { app } from '../../server'
import { logger } from '@magicox/lib'

export function startHandler() {
  // TODO: custom port
  app.listen(8080, () => logger.success('Magicox App is starting!'))
}
