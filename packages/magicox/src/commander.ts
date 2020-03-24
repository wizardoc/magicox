import { cac } from "cac";
import CAC from "cac/types/CAC";

type CLIParser = (cli: CAC) => void;

interface CLIParsers {
  prepare: CLIParser;
  afterParse: CLIParser;
}

export const CLI = ({ afterParse, prepare }: CLIParsers) => {
  const cli = cac();

  prepare(cli);
  cli.parse(process.argv);
  afterParse(cli);
};
