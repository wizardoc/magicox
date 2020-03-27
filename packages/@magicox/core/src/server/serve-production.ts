import Koa from 'koa'
import Router from 'koa-router'
import Path from 'path'
import { getDistPath } from '../utils'
import { SERVER_ENTRY_NAME, TemplateRenderer, RenderLabel } from '../renderer'
import Static from 'awesome-static'
import { renderToString } from 'react-dom/server'
import { ReactElement } from 'react'

const app = new Koa()
const router = new Router()

interface ServerEntry {
  app: ReactElement
}

app.use(async (...params) =>
  Static(Path.join(await getDistPath()), {
    route: 'dist',
  })(...params)
)

router.get('*', async ctx => {
  const distPath = await getDistPath()
  const { app } = require(Path.join(distPath, SERVER_ENTRY_NAME)) as ServerEntry
  const tplRenderer = await TemplateRenderer.createRendererByFileName(
    'index.html'
  )

  ctx.set('Content-Type', 'text/html')

  ctx.body = tplRenderer.renderLabel(
    RenderLabel.CONTENT_OUTLET,
    `<div id="root">${renderToString(app)}</div>`
  )
})

app.use(router.routes())

export { app }
