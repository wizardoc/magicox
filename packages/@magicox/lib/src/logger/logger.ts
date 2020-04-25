import Chalk from 'chalk'
import { LoggerLevel, Level } from './logger-level'

export class Logger {
  constructor(private level: LoggerLevel | undefined = LoggerLevel.ERROR) {}

  setLevel(level: LoggerLevel) {
    this.level = level

    return this
  }

  @Level(LoggerLevel.INFO)
  request(method: string, status: number, hostname: string, path: string) {
    const statusChalk = /^2/.test(status + '') ? Chalk.bgGreen : Chalk.bgYellow

    console.info(
      statusChalk.white(status),
      hostname,
      path,
      Chalk.bgBlue.white(method)
    )
  }

  @Level(LoggerLevel.WARN)
  warn(...infos: any[]) {
    console.warn(Chalk.yellow('warning'), ...infos)
  }

  @Level(LoggerLevel.PANIC)
  panic(...infos: any[]) {
    console.error(Chalk.bgRed.white('PANIC'), '🙀', ...infos)
    process.exit()
  }

  @Level(LoggerLevel.INFO)
  tip(...infos: any[]) {
    console.info(Chalk.white('tip'), '📄', ...infos)
  }

  @Level(LoggerLevel.INFO)
  success(...infos: any[]) {
    console.info(Chalk.green('success'), '👏', ...infos)
  }

  @Level(LoggerLevel.INFO)
  info(...infos: any[]) {
    console.info(Chalk.blue('info'), '🎙️', ...infos)
  }

  @Level(LoggerLevel.DEBUG)
  debug(...infos: any[]) {
    console.info(Chalk.gray('debug'), '🐛', ...infos)
  }

  @Level(LoggerLevel.ERROR)
  error(...infos: any[]) {
    console.error(Chalk.red('error'), '❌', ...infos)
  }
}

export const logger = new Logger()
