import { CLI } from "./commander";
import CAC from "cac/types/CAC";

CLI({
  prepare(cli: CAC) {},
  afterParse(cli: CAC) {}
});
