import { Middleware } from './middleware'
import Path from 'path'
import { findRootPath, logger } from '@magicox/lib'
import ShortID from 'shortid'
import { ComponentType } from 'react'

interface AliasMapping {
  [alias: string]: string
}

export interface RouteComponentMapping<T = string> {
  path: string
  component: T
}

export type ParsedRouteComponentMapping = RouteComponentMapping<ComponentType>

export interface MagicoxRoute {
  path: string
  component: string // component path
  layout?: string // layout component path
  exact?: boolean
  redirect?: MagicoxRoute['path']
  middlewares?: Middleware[]
  children?: MagicoxRoute[]
}

export interface ParsedMagicoxRoute extends MagicoxRoute {}

export class RouterService {
  private parsedRoutes: ParsedMagicoxRoute[] | undefined
  private routeComponents: string | undefined

  constructor(private routes: MagicoxRoute[]) {}

  async getParsedRoutes(): Promise<ParsedMagicoxRoute[]> {
    if (this.parsedRoutes) {
      return this.parsedRoutes
    }

    const parsedRoutes: ParsedMagicoxRoute[] = []

    for (const route of this.routes) {
      let attach: any = {}

      if (route.component) {
        attach.component = await this.preparePath(route.component)
      }

      if (route.layout) {
        attach.layout = await this.preparePath(route.layout)
      }

      parsedRoutes.push({
        ...route,
        ...attach,
      })
    }

    return (this.parsedRoutes = parsedRoutes)
  }

  private async getAliasMapping(): Promise<AliasMapping> {
    const rootPath = await findRootPath()

    return {
      '~': rootPath,
    }
  }

  private async preparePath(path: string) {
    const aliases = await this.getAliasMapping()

    for (const alias of Object.keys(aliases)) {
      const regex = new RegExp(`^${alias}`)

      if (regex.test(path)) {
        return Path.join(aliases[alias], path.slice(1))
      }
    }

    return path
  }

  async genRouteComponents(): Promise<
    [string, string, RouteComponentMapping[]]
  > {
    const routes = await this.getParsedRoutes()
    const imports = []
    const routeComponents = []
    // component instance <-> path
    const routeComponentMappings: RouteComponentMapping[] = []

    for (const { exact, component, path, layout, redirect } of routes) {
      // redirect
      if (redirect) {
        routeComponents.push(`
          <Redirect exact={!!${exact}} path='${path}' to='${redirect}' />
        `)

        continue
      }

      const [importDeclaration, componentName] = this.parseComponentName(
        this.parseComponent(component)
      )
      let layoutName = ''

      imports.push(importDeclaration)

      // import layout
      if (layout) {
        const [importDeclaration, name] = this.parseComponentName(
          this.parseComponent(layout)
        )

        imports.push(importDeclaration)
        layoutName = name
      }

      routeComponents.push(`
        <Route
          exact={!!${exact}}
          path='${path}'
          render={() => <${layoutName}><${componentName} {...(() => {
            if(process.env.server){
              return initData
            } else {
              return window.__INIT_DATA__
            }
          })()} /></${layoutName}>}
        />
      `)

      routeComponentMappings.push({ path, component: componentName })
    }

    return [
      imports.join('\n'),
      routeComponents.join('\n'),
      routeComponentMappings,
    ]
  }

  private parseComponentName(info: string[]): [string, string] {
    const [importPath, entryPoint] = info
    const componentName = `C_${ShortID.generate().replace('-', '')}`
    const parsedEntryPoint = entryPoint
      ? `{${entryPoint} as ${componentName}}`
      : `C_${componentName}`

    return [`import ${parsedEntryPoint} from '${importPath}';`, componentName]
  }

  private parseComponent(component: string): string[] {
    return component.split('#')
  }

  // match url to get componentd
  private matchComponentPath(url: string): string | undefined {
    // query cache first
    // const cache = this.routeCache[url]

    // if (cache) {
    //   return cache
    // }

    for (const route of this.routes) {
      // return matched component or NotFound component
      if (this.comparePath(url, route) || !route.path || route.path === '*') {
        return route.component
      }
    }
  }

  private comparePath(url: string, { exact, path }: MagicoxRoute): boolean {
    return exact
      ? new RegExp(`^${path}\/?$`).test(url)
      : new RegExp(`${path}`).test(url)
  }
}
