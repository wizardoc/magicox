#!/usr/bin/env node

import { CLI } from './commander'
import CAC from 'cac/types/CAC'
import { handleUnknownCommand } from './handle-unknown-command'
import { logger, LoggerLevel } from '@magicox/lib'
import { App } from '@magicox/core'

const app = new App()

CLI({
  prepare(cli: CAC) {
    const { version } = require('../package.json')

    // init level of logger
    logger.setLevel(LoggerLevel.ALL)

    cli.version(version)

    cli
      .command('dev <filename>', 'start dev server with specify the file')
      .action((filename: string) => app.dev(filename))

    cli
      .command('build <filename>', 'build magicox app')
      .action((filename: string) => app.build(filename))

    cli.command('start', 'start magicox app').action(() => app.start())

    cli.help()
  },
  afterParse(cli: CAC) {
    // cli.outputHelp();
    handleUnknownCommand(cli)
  },
})
