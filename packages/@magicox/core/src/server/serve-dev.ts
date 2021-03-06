import Koa from 'koa'
import Router from 'koa-router'
import { TemplateRenderer, RenderLabel, DevRenderer } from '../renderer'
import ClientWebpackConfigFactory from '../configs/webpack.config.client'
import ServerWebpackConfigFactory from '../configs/webpack.config.server'
import { renderToString } from 'react-dom/server'
import { matchRoutes } from 'react-router-config'
import { configure, webpackBuild, logger } from '@magicox/lib'
import Path from 'path'
import { MagicoxRoute } from '@magicox/router'
import { transformFileSync } from '@babel/core'
import VM from 'vm'
import { LoggerMiddleware } from './middlewares/logger-middleware'

interface PageComponent {
  preFetch?(): Promise<unknown>
}

const app = new Koa()
const router = new Router()

export async function createApp() {
  const ClientWebpackConfig = await ClientWebpackConfigFactory()
  const ServerWebpackConfig = await ServerWebpackConfigFactory()
  const ComponentWebpackConfig = { ...ServerWebpackConfig }
  const devRenderer = DevRenderer.createInstance(
    ClientWebpackConfig,
    ServerWebpackConfig
  )

  app.use(async (_ctx, next) => {
    await devRenderer.isBuilding()
    await next()
  })

  app.use((ctx, next) => devRenderer.devMiddleware(ctx, next))

  app.use((ctx, next) => devRenderer.hotMiddleware(ctx, next))

  router.use(LoggerMiddleware)

  router.get('*', async ctx => {
    ctx.set('Content-Type', 'text/html')

    logger.debug(ctx.path)

    const [tpl, routerFn, routesMapping] = devRenderer.buildAssets()
    const tplRenderer = TemplateRenderer.createRendererByTemplate(tpl)
    const router = await configure.getRouter()
    const routes = await router.getParsedRoutes()
    const context = {}

    const res = await Promise.all(
      matchRoutes(routesMapping as any, ctx.path).map(async ({ route }) => {
        const { preFetch } = (route.component as unknown) as PageComponent

        // logger.tip(preFetch)

        return preFetch ? await preFetch() : undefined

        // logger.debug(routerFn(ctx.url, context))

        // const result = transformFileSync(path, {
        //   presets: ['@babel/env', '@babel/react'],
        // })
        // const sandBox = {
        //   console,
        //   module,
        //   require,
        //   exports,
        // }

        // VM.runInNewContext(result?.code ?? '', sandBox)

        // logger.debug(sandBox.exports[name].foo)

        //   console.info(importPath)

        //   ComponentWebpackConfig.output!.filename = filename
        //   ComponentWebpackConfig.output!.path = importPath

        //   webpackBuild(ComponentWebpackConfig, () => {
        //     const m = devRenderer.genModuleReader(filename, importPath)()

        //     console.info(m.exports[name])
        //   })

        //   return 1
      })
    )

    console.info(res)

    ctx.body = tplRenderer
      .appendScripts(`window.__INIT_DATA__ = ${JSON.stringify(res[0])}`)
      .renderLabel(
        RenderLabel.CONTENT_OUTLET,
        `<div id="root">${renderToString(
          routerFn(ctx.path, context, res[0])
        )}</div>`
      ).template
  })

  app.use(router.routes())

  return app
}
