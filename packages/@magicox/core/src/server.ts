import Koa from 'koa'
import Router from 'koa-router'
import FS from 'fs-extra'
import Path from 'path'
import { getDistPath } from './utils'
import { SERVER_ENTRY_NAME } from './renderer'
import Static from 'awesome-static'
import { renderToString } from 'react-dom/server'

const app = new Koa()
const router = new Router()

interface ServerEntry {
  app: any
}

app.use(async (...params) =>
  Static(Path.join(await getDistPath()), {
    route: 'dist',
  })(...params)
)

router.get('*', async ctx => {
  const distPath = await getDistPath()
  const { app } = require(Path.join(distPath, SERVER_ENTRY_NAME)) as ServerEntry

  ctx.set('Content-Type', 'text/html')

  ctx.body = (
    await FS.readFile(Path.join(distPath, 'index.html'), 'utf-8')
  ).replace(
    /<ssr-content-outlet\s*\/?>(<\/?ssr-content-outlet>)?/,
    `<div id="root">${renderToString(app)}</div>`
  )
})

app.use(router.routes())

export { app }
