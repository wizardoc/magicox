import { Renderer, CLIENT_ENTRY_NAME } from './renderer'
import { writeInConfig, configure } from '@magicox/lib'

export class ClientRenderer extends Renderer {
  async genEntry(): Promise<string> {
    const entryPointTpl = await this.getEntryPoint()
    const [imports, body] = await (
      await configure.getRouter()
    ).genRouteComponents()

    return `
      import React from 'react'
      import {hydrate} from 'react-dom'
      import ${entryPointTpl} from '${this.entryModulePath}'
      import {Route, BrowserRouter, Redirect} from 'react-router-dom'
      // routes
      ${imports}

      const Routes = () => <BrowserRouter>${body}</BrowserRouter>

      hydrate(<Routes />, document.getElementById('root'))

      if(module.hot) {
        module.hot.accept("${this.entryModulePath}", () => {
          hydrate(<Routes />, document.getElementById('root'))
        })
      }
    `
  }
  async writeEntry(): Promise<void> {
    return writeInConfig(CLIENT_ENTRY_NAME, await this.genEntry())
  }
}
