import { devHandler } from './handlers/dev'
import { buildHandler } from './handlers/build'
import { startHandler } from './handlers/start'

export class App {
  constructor() {}

  build(filename: string) {
    buildHandler(filename)
  }

  dev(filename: string) {
    devHandler(filename)
  }

  start() {
    startHandler()
  }
}
