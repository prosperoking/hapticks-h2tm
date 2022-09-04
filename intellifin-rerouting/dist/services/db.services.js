"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../db/models/transaction.model"));
const mappers_1 = __importDefault(require("../helpers/mappers"));
;
class DBServices {
    constructor() {
        this.DbrecordInstance = null;
    }
    createTransactionRecord(data, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbData = mappers_1.default.mapTransRequestDataToDbSchema(data, product);
            console.log("Formmatted Payload :: ", dbData);
            this.DbrecordInstance = new transaction_model_1.default(dbData);
            let saved = true;
            return yield this.DbrecordInstance.save().then((data) => {
                saved = true;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            }).catch((err) => {
                saved = false;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            });
        });
    }
    updateTransactionRecord(vasResponse, product) {
        return __awaiter(this, void 0, void 0, function* () {
            let saved = true;
            let responseData = mappers_1.default.mapTransResponseDataToDbSchema(vasResponse, product);
            // let vasDataToSave = vasResponse.data ? { ...vasResponse, ...vasResponse.data } : { ...vasResponse };
            let vasDataToSave = Object.assign({}, responseData);
            return yield this.DbrecordInstance.set(vasDataToSave).save().then(() => {
                saved = true;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            }).catch(() => {
                saved = false;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            });
        });
    }
    updateTransactionStatus(status, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            let saved = true;
            return yield this.DbrecordInstance.set({ isCompleted: status, extraData: extraData }).save().then(() => {
                saved = true;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            }).catch(() => {
                saved = false;
                return { saved, DbrecordInstance: this.DbrecordInstance };
            });
        });
    }
}
exports.default = DBServices;
//# sourceMappingURL=db.services.js.map