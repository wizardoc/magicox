import { Renderer, SERVER_ENTRY_NAME } from './renderer'
import { writeInConfig } from '../utils'

export class ServerRenderer extends Renderer {
  genEntry(): string {
    return `
      import React from 'react';
      import App from '${this.entryModulePath}';

      const app = () => <App />;

      export {app}
    `
  }

  writeEntry(): Promise<void> {
    const tpl = this.genEntry()

    return writeInConfig(SERVER_ENTRY_NAME, tpl)
  }
}
