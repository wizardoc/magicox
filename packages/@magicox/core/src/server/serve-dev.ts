import Koa from 'koa'
import Router from 'koa-router'
import { TemplateRenderer, RenderLabel, DevRenderer } from '../renderer'
import ClientWebpackConfigFactory from '../configs/webpack.config.client'
import ServerWebpackConfigFactory from '../configs/webpack.config.server'
import { renderToString } from 'react-dom/server'
import { matchRoutes } from 'react-router-config'
import { configure } from '@magicox/lib'

const app = new Koa()
const router = new Router()

export async function createApp() {
  const ClientWebpackConfig = await ClientWebpackConfigFactory()
  const ServerWebpackConfig = await ServerWebpackConfigFactory()
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

  router.get('*', async ctx => {
    ctx.set('Content-Type', 'text/html')

    const [tpl, routerFn] = devRenderer.buildAssets()
    const tplRenderer = TemplateRenderer.createRendererByTemplate(tpl)
    const router = await configure.getRouter()
    const routes = await router.getParsedRoutes()
    // const res = matchRoutes(routes as any, ctx.url).map()

    ctx.body = tplRenderer.renderLabel(
      RenderLabel.CONTENT_OUTLET,
      `<div id="root">${renderToString(routerFn(ctx.url, {}))}</div>`
    )
  })

  app.use(router.routes())

  return app
}
