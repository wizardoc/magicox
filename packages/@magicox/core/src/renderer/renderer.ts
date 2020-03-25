import Path from 'path'
import { getCWD } from '../utils/path'

export const SERVER_ENTRY_NAME = 'server-entry.js'
export const CLIENT_ENTRY_NAME = 'client-entry.js'

export abstract class Renderer {
  protected entryModulePath: string

  // filename may is undefined when use start processor
  constructor(filename: string) {
    this.entryModulePath = Path.join(getCWD(), filename)
  }

  abstract genEntry(): string
  abstract writeEntry(): void
}
