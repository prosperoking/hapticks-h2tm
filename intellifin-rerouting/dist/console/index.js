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
cli.parse();
//# sourceMappingURL=index.js.map