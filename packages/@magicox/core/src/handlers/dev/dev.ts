import { logger } from '@magicox/lib'
import { createEntry } from '../../utils'
import { createApp } from '../../server/serve-dev'
import { configure } from '@magicox/lib'

export async function devHandler(filename: string) {
  configure.filename = filename
  await createEntry(filename)

  const {
    dev: { port },
  } = await configure.getConfig()

  const app = await createApp()

  app.listen(port, () => logger.success('Magicox App is starting!'))
}
