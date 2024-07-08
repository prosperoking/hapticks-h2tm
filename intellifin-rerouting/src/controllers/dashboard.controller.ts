import routeLog from "../decorators/requestLogger";
import { Response, Request } from "express";
import vasjournalsModel from "../db/models/transaction.model";
import logger from "../helpers/logger";
import Terminal from "../db/models/terminal.model";
import moment from "moment";
export default class DashboardController {
  public async index(request: Request, response: Response) {
    try {
      const { query } = request;
      const date = (
        query.date ? moment(new Date(`${query.date}`)) : moment()
      ).format("YYYY-MM-DD");
      const transactionTime = {
        $gte: moment(date).toDate(),
        $lt: moment(date)
              .add(23, "hours")
              .add(59, "minutes")
              .add(60, "seconds")
              .toDate(),
      };

      const totalTransactionsToday = await vasjournalsModel
        .where({
          transactionTime
        })
        .count();
      const totalFailedTransactionsToday = await vasjournalsModel
        .where({
          transactionTime,
          responseCode: {
            $ne: "00",
          },
        })
        .count();

      const stats = await vasjournalsModel.aggregate(
        [
          {
            $match: {
              createdAt: transactionTime,
              //@ts-ignore
              organisationId: request.user.organisation_id ?? undefined
            },
          },
          {
            $group: {
              _id: "$processor",
              total: { $sum: 1 },
              approved: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$responseCode", "00"],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              insufficientFund: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$responseCode", "51"],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              incorrectPin: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$responseCode", "55"],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              issuerInOperative: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$responseCode", "91"],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              noResponse: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$responseCode", ""] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              others: {
                $sum: {
                  $cond: {
                    if: {
                      $not: {
                        $in: ["$responseCode", ["", "00", "55", "51", "91"]],
                      },
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              processor: "$_id",
              total: "$total",
              approved: "$approved",
              insufficeintFund: "$insufficientFund",
              incorrectPin: "$incorrectPin",
              issuerInOperative: "$issuerInOperative",
              noResponse: "$noResponse",
              others: "$others",
            },
          },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      );
      const lastestTransacions = await vasjournalsModel.find({
          transactionTime,
          //@ts-ignore
          organisationId: request.user.organisation_id ?? undefined
        })
        .sort({ _id: -1 })
        .limit(50);
      const terminalCount = await Terminal.find({}).count();
      return response.json({
        totalTransactionsToday,
        totalFailedTransactionsToday,
        lastestTransacions,
        terminalCount,
        stats,
      });
    } catch (error) {
      logger.error(error.message);
      response.status(400).json({
        message: "An error occured",
      });
    }
  }

  public async transactions(request: Request, response: Response) {
    try {
      const date = moment().format("YYYY-MM-DD");
      // @ts-ignore
      const organisationFilter = request.user?.organisation_id
        // @ts-ignore
        ? { organisationId: request.user?.organisation_id }
        : {};
      console.log(request.query);
      const transactions = await vasjournalsModel.paginate(
        {
          ...DashboardController.filterGen(request.query),

          ...organisationFilter,
        },
        {
          sort: { _id: -1 },
          limit: Number(request.query.limit || 50),
          page: Number(request.query.page || 1),
          populate: [{ path: "organisation" }],
        }
      );

      return response.json(transactions);
    } catch (error) {
      logger.error(error.message);
      response.status(400).json({
        message: "An error occured",
      });
    }
  }

  public async export(request: Request, response: Response) {
    try {
      const date = moment().format("YYYY-MM-DD");
      // @ts-ignore
      const organisationFilter = request.user?.organisation_id
        // @ts-ignore
        ? { organisationId: request.user?.organisation_id }
        : {};

      response.header("Content-Type", "text/csv; charset=utf-8");
      response.attachment(`transactions-${Date.now()}.csv`);
      vasjournalsModel
        .find({
          ...DashboardController.filterGen(request.query),
          ...organisationFilter,
        })
        .sort({ _id: -1 })
        .cursor()
        .pipe(vasjournalsModel.csvTransformStream())
        .pipe(response);
    } catch (error) {
      logger.error(error.message);
      response.status(400).json({
        message: "An error occured",
      });
    }
  }

  private static filterGen({
    q,
    organisation,
    startDate,
    endDate,
    processor,
  }: any) {
    console.log(processor);
    let query = {};
    if (q !== undefined) {
      query = {
        ...query,
        $or: [
          {
            terminalId: RegExp(`^${q}`, "i"),
          },
          {
            rrn: RegExp(`^${q}`, "i"),
          },
          {
            merchantName: RegExp(`${q}`, "i"),
          },
          {
            merchantId: RegExp(`^${q}`, "i"),
          },
        ],
      };
    }

    if (
      processor !== undefined &&
      ["kimono", "nibss", "3line", "hydrogen", "isw"].includes(
        processor.toLowerCase()
      )
    ) {
      query = { ...query, processor: processor.toUpperCase() };
    }

    if (organisation !== undefined) {
      query = { ...query, organisationId: organisation };
    }

    if (Boolean(startDate)) {
      query = {
        ...query,
        $and: [
          {
            transactionTime: {
              $gte: moment(startDate).toDate(),
            },
          },
        ],
      };
    }
    if (Boolean(endDate)) {
      query = {
        ...query,
        $and: [
          ...(query["$and"] || []),
          {
            transactionTime: {
              $lte: moment(endDate).toDate(),
            },
          },
        ],
      };
    }
    console.log("query: ", query);
    return query;
  }
}
