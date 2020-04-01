import { Renderer, SERVER_ENTRY_NAME } from './renderer'
import { writeInConfig, configure } from '@magicox/lib'

export class ServerRenderer extends Renderer {
  async genEntry(): Promise<string> {
    const entryPointTpl = await this.getEntryPoint()
    const [imports, body] = await (
      await configure.getRouter()
    ).genRouteComponents()

    return `
      import React from 'react';
      import ${entryPointTpl} from '${this.entryModulePath}';
      import {Route, StaticRouter} from 'react-router-dom'
      // routes
      ${imports}

      export const router = (context, location) => 
        <StaticRouter location={location} context={context}>${body}</StaticRouter>
    `
  }

  async writeEntry(): Promise<void> {
    return writeInConfig(SERVER_ENTRY_NAME, await this.genEntry())
  }
}
