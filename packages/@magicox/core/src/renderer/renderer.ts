import Path from 'path'
import { configure, getCWD } from '@magicox/lib'

export const SERVER_ENTRY_NAME = 'server-entry.js'
export const CLIENT_ENTRY_NAME = 'client-entry.js'

export abstract class Renderer {
  constructor(protected entryModulePath: string) {}

  async getEntryPoint(): Promise<string> {
    const { entryPoint } = await configure.getConfig()

    return entryPoint ? `{${entryPoint} as App}` : 'App'
  }

  abstract genEntry(): Promise<string>
  abstract writeEntry(): Promise<void>
}
