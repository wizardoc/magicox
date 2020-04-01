import { app } from '../../server/serve-production'
import { logger } from '@magicox/lib'
import { configure } from '@magicox/lib'

export async function startHandler() {
  const { port } = await configure.getConfig()

  app.listen(port, () => logger.success('Magicox App is starting!'))
}
