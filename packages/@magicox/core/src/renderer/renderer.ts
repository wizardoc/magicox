import Path from 'path'
import { getCWD } from '../utils/path'
import { configure } from '../services'

export const SERVER_ENTRY_NAME = 'server-entry.js'
export const CLIENT_ENTRY_NAME = 'client-entry.js'

export abstract class Renderer {
  protected entryModulePath: string

  // filename may is undefined when use start processor
  constructor(filename: string) {
    this.entryModulePath = Path.join(getCWD(), filename)
  }

  async getEntryPoint(): Promise<string> {
    const { entryPoint } = await configure.getConfig()

    return entryPoint ? `{${entryPoint} as App}` : 'App'
  }

  abstract genEntry(): Promise<string>
  abstract writeEntry(): Promise<void>
}
