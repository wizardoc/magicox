import webpack, { Stats, Configuration } from 'webpack'
import { logger } from '@magicox/lib'

export function webpackBuild(config: Configuration): Promise<Stats> {
  return new Promise((resolve, reject) =>
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)

        return
      }

      const parsedStats = stats.toJson()

      if (stats.hasWarnings()) {
        logger.warn(parsedStats.warnings.toString())
      }

      if (stats.hasErrors()) {
        logger.error(parsedStats.errors.toString())
      }

      resolve(stats)
    })
  )
}
