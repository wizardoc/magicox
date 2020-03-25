import { cac } from 'cac'
import CAC from 'cac/types/CAC'
import { logger } from '@magicox/lib'

type CLIParser = (cli: CAC) => void

interface CLIParsers {
  prepare: CLIParser
  afterParse: CLIParser
}

export const CLI = ({ afterParse, prepare }: CLIParsers) => {
  const cli = cac()

  prepare(cli)

  // catch the missing arg
  try {
    cli.parse(process.argv)
  } catch (e) {
    logger.panic(e.message)
  }

  afterParse(cli)
}
