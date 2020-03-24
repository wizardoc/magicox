import { Logger } from "./logger";

export * from "./logger";

const logger = new Logger(1);

logger.warn();
