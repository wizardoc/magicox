import { logger } from '@magicox/lib'
import { createEntry } from '../../utils'
import { createApp } from '../../server/serve-dev'

export async function devHandler(filename: string) {
  await createEntry(filename)

  const app = await createApp()

  app.listen(8000, () => logger.success('Magicox App is starting!'))
}
