import FS from 'fs-extra'
import { logger } from '@magicox/lib'
import { ServerRenderer, ClientRenderer, Renderer } from '../renderer'

export async function createEntry(filename: string) {
  checkDevFileExist(filename)

  await persistEntry(new ServerRenderer(filename))
  await persistEntry(new ClientRenderer(filename))
}

function persistEntry(renderer: Renderer): Promise<void> {
  return renderer.writeEntry()
}

// check the file whether is exist or not
function checkDevFileExist(filename: string) {
  if (!FS.existsSync(filename)) {
    logger.panic(`${filename} is not exist`)
  }
}
