"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
class Config {
    constructor() {
        this.configObject = {
            DATABASE_URL: process.env.DATABASE_URL,
            SECRET_KEY: process.env.API_SECRET_KEY,
            DATABASE_HOSTNAME: process.env.DB_HOST,
            DATABASE_PORT: process.env.MDB_PORT,
            DATABASE_NAME: process.env.DB_NAME,
            enable_logging: [1, '1', 'true', true].includes(process.env.DB_LOGGING),
            options: {
                user: process.env.DB_USERNAME || '',
                pass: process.env.DB_PASSWORD || '',
                keepAlive: true,
                keepAliveInitialDelay: 300000,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
        };
    }
    getConfig(env) {
        return this.configObject;
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map