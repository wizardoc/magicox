import { Renderer, SERVER_ENTRY_NAME } from './renderer'
import { writeInConfig } from '../utils'

export class ServerRenderer extends Renderer {
  async genEntry(): Promise<string> {
    const entryPointTpl = await this.getEntryPoint()

    return `
      import React from 'react';
      import ${entryPointTpl} from '${this.entryModulePath}';

      const app = () => <App />;

      export {app}
    `
  }

  async writeEntry(): Promise<void> {
    return writeInConfig(SERVER_ENTRY_NAME, await this.genEntry())
  }
}
