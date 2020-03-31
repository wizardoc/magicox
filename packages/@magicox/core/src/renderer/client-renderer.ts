import { Renderer, CLIENT_ENTRY_NAME } from './renderer'
import { writeInConfig } from '../utils'

export class ClientRenderer extends Renderer {
  async genEntry(): Promise<string> {
    const entryPointTpl = await this.getEntryPoint()

    return `
      import React from 'react'
      import {hydrate} from 'react-dom'
      import ${entryPointTpl} from '${this.entryModulePath}'

      hydrate(<App />, document.getElementById('root'))

      if(module.hot) {
        module.hot.accept("${this.entryModulePath}", () => {
          hydrate(<App />, document.getElementById('root'))
        })
      }
    `
  }
  async writeEntry(): Promise<void> {
    return writeInConfig(CLIENT_ENTRY_NAME, await this.genEntry())
  }
}
