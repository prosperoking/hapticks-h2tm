import moment from "moment";
import winston from "winston";

class Logger {
  log(data: any) {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }

    console.error(moment().toString(), data);
  }

  error(data: any) {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }

    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
    });

    logger.error(`${moment().toString()} ${data}`);
  }

  logWinston(data: any) {

    if (typeof data === "object") {
        data = JSON.stringify(data);
    }

    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
    });

    logger.info(`${moment().toString()} ${data}`);


  }


}

export default new Logger();
