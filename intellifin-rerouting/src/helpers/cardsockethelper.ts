import net from "net";
import logger from "./logger";

export interface CardSocketResponse<T> {
  status: boolean;
  message?: string;
  data?: T | any;
}

export enum TransactionTypes {
  KEY_EXCHANGE = "KEY EXCHANGE",
  ISO_TRANSACTION = "ISO",
  NIBSS_TRANSACTION = "NIBSS",
  ISW_KIMONO = "KIMONO",
  BALACE_CHECK = "BALANCE",
  BLUESALT = "BLUESALT",
  THREELINE = "3LINE",
  THREELINE_KEY_EXCHANGE = "3LINE_KEY_EXCHANGE",
  ISW_KEY_EXCHANGE = 'ISW_KEY_EXCHANGE',
  ISW_PURCHASE = 'ISW_PURCHASE',
  ISW_CLOSE_CONNECTIONS = 'ISW_CLOSE_CONNECTIONS',
  ISW_CONNECTIONS_COUNT = 'ISW_CONNECTIONS_COUNT',
  HYDROGEN_KEY_EXCHANGE = 'HYDROGEN_KEY_EXCHANGE',
  HYDROGEN_PURCHASE = 'HYDROGEN_PURCHASE',
  HYDROGEN_CLOSE_CONNECTIONS = 'HYDROGEN_CLOSE_CONNECTIONS',
  HYDROGEN_CONNECTIONS_COUNT = 'HYDROGEN_CONNECTIONS_COUNT',
  HABARI_KEY_EXCHANGE = 'HABARI_KEY_EXCHANGE',
  HABARI_PURCHASE = 'HABARI_PURCHASE',
  HABARI_CLOSE_CONNECTIONS = 'HABARI_CLOSE_CONNECTIONS',
  HABARI_CONNECTIONS_COUNT = 'HABARI_CONNECTIONS_COUNT'
}

export function sendSocketMessage<T>(
  transaction: TransactionTypes,
  payload: any
): Promise<CardSocketResponse<T>> {
  return new Promise((resolve, reject) => {
    let response = [];
    const socket = net.connect(
      {
        host: process.env.CARD_SERVICE_HOST,
        port: parseInt(process.env.CARD_SERVICE_PORT),
        timeout: 60000 * 16,
      },
      () => {
        logger.log("Connected to card service socket to perform operation");
        socket.write(
          Buffer.from(JSON.stringify({ transaction, ...payload }) + "\n"),
          (err) => {
            if (err) {
              logger.log(err);
              socket.end();
              return reject(err);
            }
            logger.log("Write Successful");
          }
        );
      }
    );

    socket
      .on("data", (data) => {
        response = [...response, data];
      })
      .on("error", (err) => {
        socket.end();
        reject({
          status: false,
          payload,
          message: err.message,
        });
      })
      .on("end", () => {
        const allResponse = Buffer.concat(response);
        try {
          resolve(JSON.parse(allResponse.toString()));
        } catch (error) {
          reject({
            status: false,
            payload,
            message: error.message,
          });
        }
      })
      .on("timeout", () =>
        reject({
          status: false,
          payload,
          message: "Connection timed out",
        })
      );
  });
}
