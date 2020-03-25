import CAC from 'cac/types/CAC'
import { logger } from '@magicox/lib'
import Link from 'terminal-link'

export function handleUnknownCommand(cli: CAC) {
  if (!isUnknownCommand(cli)) {
    return
  }

  logUnknownCommand(cli)
}

const isUnknownCommand = (cli: CAC): boolean => !cli.matchedCommand

const logUnknownCommand = (cli: CAC) => {
  const commands = cli.args

  if (!commands.length) {
    logger.warn(
      `You may want to use 'dev' or 'start', see the document for more commands. ${Link(
        '',
        'https://github.com/wizardoc/magicox​'
      )}`
    )

    return
  }

  logger.error(`Unknown command ${commands[0]}`)
}
