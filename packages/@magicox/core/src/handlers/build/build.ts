import { createEntry } from '../../utils'
import webpack from 'webpack'
import ClientWebpackConfigFactory from '../../configs/webpack.config.client'
import ServerWebpackConfigFactory from '../../configs/webpack.config.server'
import { logger, webpackBuild, configure } from '@magicox/lib'
import { Configuration } from 'webpack'

export async function buildHandler(filename: string) {
  configure.filename = filename
  await createEntry(filename)

  const ClientWebpackConfig = await ClientWebpackConfigFactory()
  const ServerWebpackConfig = await ServerWebpackConfigFactory()

  try {
    await Promise.all([
      webpackBuild(mixProductionMode(ClientWebpackConfig)),
      webpackBuild(mixProductionMode(ServerWebpackConfig)),
    ])
    // console.info(stats)
  } catch (e) {
    logger.error(e)
  }
}

function mixProductionMode(config: Configuration): Configuration {
  return { ...config, mode: 'production' }
}
