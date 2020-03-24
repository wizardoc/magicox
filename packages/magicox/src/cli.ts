#!/usr/bin/env node

import { CLI } from "./commander";
import CAC from "cac/types/CAC";
import { handleUnknownCommand } from "./handle-unknown-command";

CLI({
  prepare(cli: CAC) {
    const { version } = require("../package.json");

    cli.version(version);
    cli
      .command("dev [filename]", "start dev server with specify the file")
      .action(() => console.info("www"));
    cli.help();
  },
  afterParse(cli: CAC) {
    // cli.outputHelp();
    handleUnknownCommand(cli);
  }
});
