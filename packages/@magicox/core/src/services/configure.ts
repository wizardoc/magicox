import Path from 'path'
import { cosmiconfig } from 'cosmiconfig'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'
import { shallowExtends } from '../utils/shallow-extends'

const MAGICOX_CONFIG_NAME = 'magicox.config'

type CosmiconfigExplorer<F> = F extends (...params: any[]) => infer R ? R : any

interface MagicoxDevConfig {
  port: number
}

interface MagicoxConfig {
  distPath: string
  port: number
  template: string
  entryPoint: undefined | null | string
  dev: MagicoxDevConfig
}

export class Configure {
  private explorer: CosmiconfigExplorer<typeof cosmiconfig>
  private config: MagicoxConfig | undefined

  constructor() {
    const searchPlaces = ['package.json', `${MAGICOX_CONFIG_NAME}.js`]

    this.explorer = cosmiconfig(MAGICOX_CONFIG_NAME, { searchPlaces })
  }

  get defaultConfig(): MagicoxConfig {
    return {
      distPath: '',
      port: 8080,
      template: Path.join(__dirname, '../../public/template.html'),
      entryPoint: null,
      dev: {
        port: 8000,
      },
    }
  }

  async searchConfig(): Promise<MagicoxConfig> {
    let result: CosmiconfigResult

    try {
      result = await this.explorer.search()
    } catch (e) {
      return this.defaultConfig
    }

    // process empty config
    if (!result || result.isEmpty) {
      return this.defaultConfig
    }

    return shallowExtends(result.config, this.defaultConfig)
  }

  async getConfig(): Promise<MagicoxConfig> {
    return this.config ?? (this.config = await this.searchConfig())
  }
}

export const configure = new Configure()
