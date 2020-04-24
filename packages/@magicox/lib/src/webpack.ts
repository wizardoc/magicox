import webpack, { Stats, Configuration } from 'webpack'
import { logger } from '@magicox/lib'

type BuildProcessor = (err: Error, stats: Stats) => void

export function webpackBuild(
  config: Configuration,
  cb: BuildProcessor | undefined = () => {}
): Promise<Stats> {
  return new Promise((resolve, reject) =>
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)

        return
      }

      cb(err, stats)

      handleStats(stats)

      resolve(stats)
    })
  )
}

export function handleStats(stats: Stats) {
  const parsedStats = stats.toJson()

  if (stats.hasWarnings()) {
    logger.warn(parsedStats.warnings.toString())
  }

  if (stats.hasErrors()) {
    logger.error(parsedStats.errors.toString())
  }
}
