import webpack, {
  Configuration,
  Compiler,
  Entry,
  HotModuleReplacementPlugin,
  Stats,
} from 'webpack'
import Path from 'path'
import MFS from 'memory-fs'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'
import { logger, handleStats } from '@magicox/lib'
import { Middleware } from 'koa'
import { RouteComponentMapping } from '@magicox/router'

type ModuleReader<T = any> = () => T

const memFs = new MFS()

export class DevRenderer {
  private _clientCompiler: Compiler
  private _serverCompiler: Compiler
  private _devMiddleware!: Middleware
  private _hotMiddleware!: Middleware

  private tpl: string | undefined
  private router: ((location: string, context: object) => any) | undefined
  private routes: RouteComponentMapping[] | undefined
  private _isBuilding!: Promise<void>
  private buildSuccess: (() => void) | undefined

  private static instance: DevRenderer | undefined

  // private doBuildSuccess: (() => void) | undefined
  // private building: Promise<void> | undefined

  private constructor(
    private clientWebpackConfig: Configuration,
    private serverWebpackConfig: Configuration
  ) {
    this._clientCompiler = webpack(
      this.createClientWebpackConfig(clientWebpackConfig)
    )
    this._serverCompiler = webpack(serverWebpackConfig)

    this.initMiddleware()
    this.initBuildingPromise()
    this.watchSourceCode()
  }

  createClientWebpackConfig(clientWebpackConfig: Configuration): Configuration {
    return {
      ...clientWebpackConfig,
      entry: {
        app: [
          (clientWebpackConfig.entry as Entry).app,
          'webpack-hot-middleware/client',
        ],
      } as Entry,
      plugins: [
        new HotModuleReplacementPlugin(),
        ...clientWebpackConfig.plugins!,
      ],
    }
  }

  initMiddleware() {
    this._devMiddleware = devMiddleware(this._clientCompiler, {
      publicPath: this.clientWebpackConfig.output!.publicPath,
      noInfo: true,
    })
    this._hotMiddleware = hotMiddleware(this._clientCompiler)
  }

  // init building promise for block render
  initBuildingPromise() {
    this._isBuilding = new Promise<void>(
      resolve => (this.buildSuccess = resolve)
    )
  }

  watchSourceCode() {
    // pack client when accept data from hot-middleware
    this._clientCompiler.plugin('done', () => {
      try {
        this.tpl = (this._devMiddleware as any).fileSystem.readFileSync(
          Path.join(
            this.clientWebpackConfig.output!.path as string,
            'index.html'
          ),
          'utf-8'
        )

        logger.info('client builded!')

        this.notify()
      } catch (e) {
        logger.error(e)
      }
    })

    const { path, filename } = this.serverWebpackConfig.output!

    // pack server when source file is changed
    this._serverCompiler.outputFileSystem = memFs
    this._serverCompiler.watch({}, (err, stats) => {
      if (err) {
        logger.error(err)

        return
      }

      handleStats(stats)

      // read dist file in memory
      const m = this.genModuleReader(filename as string, path!)()

      this.router = m.exports.router
      this.routes = m.exports.routes

      logger.info('server builded!')

      this.notify()
    })
  }

  genModuleReader(filename: string, path: string): ModuleReader {
    return () => {
      const distFile = memFs.readFileSync(
        Path.join(path!, filename as string),
        'utf-8'
      )
      const m = new (module.constructor as any)()

      m._compile(distFile, filename)

      return m
    }
  }

  static createInstance(
    clientWebpackConfig: Configuration,
    serverWebpackConfig: Configuration
  ) {
    return (
      DevRenderer.instance ??
      (DevRenderer.instance = new DevRenderer(
        clientWebpackConfig,
        serverWebpackConfig
      ))
    )
  }

  get clientCompiler(): Compiler {
    return this._clientCompiler
  }

  get serverCompiler(): Compiler {
    return this._serverCompiler
  }

  get devMiddleware() {
    return this._devMiddleware
  }

  get hotMiddleware() {
    return this._hotMiddleware
  }

  isBuilding(): Promise<void> {
    return this._isBuilding
  }

  buildAssets(): [
    string,
    (location: string, context: object) => any,
    RouteComponentMapping[]
  ] {
    return [this.tpl!, this.router!, this.routes!]
  }

  notify() {
    if (this.tpl && this.router && this.buildSuccess) {
      this.buildSuccess()
    }
  }
}
