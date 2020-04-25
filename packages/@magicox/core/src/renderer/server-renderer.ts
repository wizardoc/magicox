import { Renderer, SERVER_ENTRY_NAME } from './renderer'
import { writeInConfig, configure } from '@magicox/lib'

export class ServerRenderer extends Renderer {
  async genEntry(): Promise<string> {
    const entryPointTpl = await this.getEntryPoint()
    const router = await configure.getRouter()
    const [imports, body, mapping] = await router.genRouteComponents()

    return `
      import React from 'react';
      import ${entryPointTpl} from '${this.entryModulePath}';
      import {Route, StaticRouter, Redirect} from 'react-router-dom'
      // routes
      ${imports}

      export const router = (location, context, initData) => 
        <StaticRouter location={location} context={context}>${body}</StaticRouter>

      export const routes = [${mapping.map(
        route => `{path: '${route.path}', component: ${route.component}}`
      )}]
    `
  }

  async writeEntry(): Promise<void> {
    return writeInConfig(SERVER_ENTRY_NAME, await this.genEntry())
  }
}
