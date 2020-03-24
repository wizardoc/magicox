import CAC from "cac/types/CAC";
import { logger } from "@magicox/lib";

export function handleUnknownCommand(cli: CAC) {
  if (!isUnknownCommand(cli)) {
    return;
  }

  logUnknownCommand(cli);
}

const isUnknownCommand = (cli: CAC): boolean => !cli.matchedCommand;

const logUnknownCommand = (cli: CAC) =>
  logger.error(`Unknown command ${cli.args[0]}`);
