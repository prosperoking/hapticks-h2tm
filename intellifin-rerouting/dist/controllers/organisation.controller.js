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
exports.destroy = exports.update = exports.create = exports.getAllOrganisations = exports.getOrganisations = void 0;
const logger_1 = __importDefault(require("../helpers/logger"));
const organisation_model_1 = __importDefault(require("../db/models/organisation.model"));
function getOrganisations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield organisation_model_1.default.paginate(Object.assign({}, filterGen(req.query)), {
                sort: { name: -1 },
                limit: Number(req.query.limit || 50),
                page: Number(req.query.page || 1),
                populate: [
                    { path: 'user_count' },
                ]
            });
            return res.json(transactions);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.getOrganisations = getOrganisations;
function getAllOrganisations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield organisation_model_1.default.find(filterGen(req.query));
            return res.json({ data });
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.getAllOrganisations = getAllOrganisations;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body } = req;
            const organisation = yield (new organisation_model_1.default(body)).save();
            return res.json(organisation);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body } = req;
            const organisation = yield organisation_model_1.default.findById(req.params.id);
            if (!organisation)
                return res.status(404).json({ message: "Organisation not found" });
            organisation.name = body.name;
            organisation.save();
            return res.json(organisation);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.update = update;
function destroy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield organisation_model_1.default.findById(req.params.id);
            if (!organisation)
                return res.status(404).json({ message: "Organisation not found" });
            organisation.delete();
            return res.json(organisation);
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(400).json({
                message: "An error occured"
            });
        }
    });
}
exports.destroy = destroy;
function filterGen({ q }) {
    let query = {};
    if (q !== undefined) {
        query = Object.assign(Object.assign({}, query), { $or: [
                {
                    name: RegExp(`^${q}`, 'i'),
                },
            ] });
    }
    return query;
}
//# sourceMappingURL=organisation.controller.js.map