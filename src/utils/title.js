import figlet from "figlet";
import { logger } from "./logger";

export function titleServer(serverName) {
  console.clear();
  figlet(serverName, { font: "Slant" }, (err, data) => {
    if (err) {
      logger.error("Something went wrong...");
      logger.error(err);
      console.dir(err);
      return;
    }
    console.log(data);
  });
  logger.info(`running in development mode. Logs will not be saved`);
}
