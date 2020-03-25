import FS from 'fs-extra'
import { logger } from '@magicox/lib'
import { ServerRenderer, ClientRenderer, Renderer } from '../renderer'

export function createEntry(filename: string) {
  checkDevFileExist(filename)

  persistEntry(new ServerRenderer(filename))
  persistEntry(new ClientRenderer(filename))
}

function persistEntry(renderer: Renderer) {
  renderer.writeEntry()
}

// check the file whether is exist or not
function checkDevFileExist(filename: string) {
  if (!FS.existsSync(filename)) {
    logger.panic(`${filename} is not exist`)
  }
}
