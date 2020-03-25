import { Renderer, CLIENT_ENTRY_NAME } from './renderer'
import { writeInConfig } from '../utils'

export class ClientRenderer extends Renderer {
  genEntry(): string {
    return `
      import React from 'react'
      import {hydrate} from 'react-dom'
      import App from '${this.entryModulePath}'

      hydrate(<App />, document.getElementById('root'))
    `
  }
  writeEntry(): Promise<void> {
    return writeInConfig(CLIENT_ENTRY_NAME, this.genEntry())
  }
}
