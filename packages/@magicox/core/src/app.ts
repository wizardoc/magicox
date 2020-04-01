import { devHandler } from './handlers/dev'
import { buildHandler } from './handlers/build'
import { startHandler } from './handlers/start'
import Path from 'path'

export class App {
  constructor() {}

  private prepareFilename = (filename: string) =>
    Path.join(process.cwd(), filename)

  build = (filename: string) => buildHandler(this.prepareFilename(filename))

  dev = (filename: string) => devHandler(this.prepareFilename(filename))

  start = () => startHandler()
}
