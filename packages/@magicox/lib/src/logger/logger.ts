import * as Chalk from "chalk";
import { LoggerLevel, Level } from "./logger-level";

export class Logger {
  constructor(private level: LoggerLevel | undefined = LoggerLevel.ERROR) {}

  setLevel(level: LoggerLevel) {
    this.level = level;

    return this;
  }

  @Level(LoggerLevel.WARN)
  warn(...infos: any[]) {
    console.warn(Chalk.yellow("warning"), ...infos);
  }

  @Level(LoggerLevel.PANIC)
  panic() {}

  @Level(LoggerLevel.INFO)
  tip() {}

  @Level(LoggerLevel.INFO)
  success() {}

  @Level(LoggerLevel.INFO)
  info() {}

  @Level(LoggerLevel.DEBUG)
  debug() {}

  @Level(LoggerLevel.ERROR)
  error() {}
}

export const logger = new Logger();
