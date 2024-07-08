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
const commander_1 = require("commander");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../helpers/logger"));
const inquirer_1 = __importDefault(require("inquirer"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const terminal_model_1 = __importDefault(require("../db/models/terminal.model"));
const appUtils_1 = require("../helpers/appUtils");
const ptspProfile_model_1 = __importDefault(require("../db/models/ptspProfile.model"));
const queue_1 = require("../queue/queue");
const config = new config_1.default();
const dbConfig = config.getConfig(process.env.NODE_ENV);
/** connection mongodb */
function connectDatabase() {
    return new Promise((resolve, reject) => {
        mongoose_1.default.Promise = global.Promise;
        logger_1.default.log("Connecting to database");
        mongoose_1.default.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
            if (err) {
                reject(err);
            }
            else {
                logger_1.default.log(`Connected to mongodb successfully on ${process.env.NODE_ENV}`);
                resolve(mongoose_1.default);
            }
        });
    });
}
const cli = new commander_1.Command();
cli.name('h2tm')
    .description("Simple cli to manage application info")
    .version("0.0.1");
cli.command('user')
    .description('Used to manage application users')
    .argument('create', 'create a user')
    .option('-a, --admin', 'Create an admin user', false)
    .action((str, options) => {
    const self = this;
    connectDatabase().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'username',
                    prefix: "1.",
                    message: "Enter Username:",
                    validate: (username) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!username.length)
                            return "Invalid Username";
                        const user = yield user_model_1.default.findOne({ username });
                        if (user)
                            return "Username already exists";
                        return true;
                    })
                },
                {
                    type: 'input',
                    name: 'email',
                    prefix: "2.",
                    message: "Enter email:",
                    validate: (email) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!email.length ||
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                            return "Invalid email";
                        const user = yield user_model_1.default.findOne({ email });
                        if (user)
                            return "Email already exists";
                        return true;
                    })
                },
                {
                    type: 'input',
                    name: 'fullname',
                    prefix: "1.",
                    message: "Enter Fullname:",
                    validate: (fullname) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!fullname.length)
                            return "Invalid Username";
                        return true;
                    })
                },
                {
                    type: 'password',
                    name: 'password',
                    mask: '*',
                    prefix: "3.",
                    message: "Enter Password:",
                    validate: (value) => {
                        return value.length >= 8 ? true : false;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    prefix: "4.",
                    message: "Select User role:",
                    choices: [
                        { name: "User", value: 'user' },
                        { name: 'Admin', value: 'admin' }
                    ],
                },
            ]);
            yield user_model_1.default.create(result);
            logger_1.default.log("User created");
        }
        catch (error) {
            logger_1.default.log(error.message);
        }
        connection.disconnect();
    }));
});
cli.command("tid")
    .description("Generate tid for terminals missing iswiso, hydogen tids")
    .argument("generate", "")
    .action((str, options) => {
    connectDatabase().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const terminals = yield terminal_model_1.default.find({
            $or: [
                { iswISOTID: null },
                { hydrogenTID: null },
            ]
        });
        let total = terminals.length;
        let result = yield inquirer_1.default.prompt([{
                type: 'confirm',
                name: 'continue',
                prefix: "1.",
                message: `Are you sure to generate ${total} affected TIDs?`,
            }]);
        if (!result.continue) {
            console.log(result);
            logger_1.default.log("Cancelled");
            return process.exit(0);
        }
        logger_1.default.log("Total affected terminals: " + total);
        if (!total) {
            logger_1.default.log("No Terminal is affected");
            process.exit(0);
        }
        const dbSession = yield terminal_model_1.default.startSession();
        yield dbSession.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const allActivities = terminals.map((terminal) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const [isw, hygdrogen] = yield Promise.all([
                    (0, appUtils_1.getAvailableTid)(terminal.id, 'isw'),
                    (0, appUtils_1.getAvailableTid)(terminal.id, 'hydrogen'),
                ]);
                terminal.iswISOTID = (_a = terminal.iswISOTID) !== null && _a !== void 0 ? _a : isw === null || isw === void 0 ? void 0 : isw.tid;
                terminal.hydrogenTID = (_b = terminal.hydrogenTID) !== null && _b !== void 0 ? _b : hygdrogen === null || hygdrogen === void 0 ? void 0 : hygdrogen.tid;
                return terminal;
            }));
            yield Promise.all(allActivities);
            return terminal_model_1.default.bulkSave(terminals);
        })).then((result) => {
            console.log(result);
            logger_1.default.log(result);
            dbSession.endSession();
            logger_1.default.log("Terminal TIDs attached");
        }).catch((error) => {
            logger_1.default.log(error);
        }).finally(() => {
            process.exit(0);
        });
    }));
});
cli.command("rotate-keys")
    .description("rotate keys for specified profile and processor")
    .action((str, opt) => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDatabase();
    const { profileId, processor } = yield inquirer_1.default.prompt([
        {
            'type': 'input',
            'name': 'profileId',
            validate: (value) => {
                return value ? true : 'Profile ID is required';
            },
            message: 'Profile ID',
        },
        {
            type: "list",
            name: "processor",
            choices: [
                "isw",
                "hydrogen",
                "habari",
            ],
            message: "Processor"
        }
    ]);
    let profile = null;
    try {
        profile = yield ptspProfile_model_1.default.findOne({
            _id: profileId,
            linkedProfile: null
        });
    }
    catch (error) {
        console.log(error.message);
        process.exit(0);
        return;
    }
    if (!profile) {
        console.log("Profile not found or not supported");
        return process.exit(0);
    }
    const removed = yield queue_1.RotateKeys.remove(profileId);
    console.log("Removed jobs: ", removed);
    queue_1.RotateKeys.add("rotateKeys", {
        id: profileId,
        type: processor,
    }, {
        repeat: {
            cron: '0 */3 * * *'
        },
        jobId: profileId,
    });
    console.log("Scheduled rotation");
    process.exit(0);
}));
cli.command("nibss-refresh-keys")
    .description("Refresh nibss keys")
    .action((str, opt) => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDatabase();
    try {
        const terminals = yield terminal_model_1.default.find({
            terminalId: {
                $ne: null
            }
        });
        for (let i = 0; i < terminals.length; i++) {
            const terminal = terminals[i];
            try {
                yield queue_1.keyExchange.add('keyexchange', { _id: terminal.id });
            }
            catch (e) {
                console.log(`Unable to trigger key exchange for:  ${terminal.terminalId}`, e);
            }
        }
        console.log(`dipached ${terminals.length} terminals for key refresh`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
        return;
    }
    process.exit(0);
}));
cli.parse();
//# sourceMappingURL=index.js.map