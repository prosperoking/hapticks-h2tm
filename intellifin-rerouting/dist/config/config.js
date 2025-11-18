"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
class Config {
    constructor() {
        var _a;
        this.configObject = {
            DATABASE_URL: process.env.DATABASE_URL,
            SECRET_KEY: process.env.API_SECRET_KEY,
            DATABASE_HOSTNAME: process.env.DB_HOST,
            DATABASE_PORT: process.env.MDB_PORT,
            DATABASE_NAME: process.env.DB_NAME,
            ADMIN_EMAILS: (process.env.ADMIN_EMAILS || '').replace(' ', '').split(','),
            enable_logging: [1, '1', 'true', true].includes(process.env.DB_LOGGING),
            options: {
                user: process.env.DB_USERNAME || '',
                pass: process.env.DB_PASSWORD || '',
                // keepAlive: true,
                // keepAliveInitialDelay: 300000,
                // useUnifiedTopology: true,
                // useNewUrlParser: true,
                minPoolSize: Number.parseInt(process.env.DB_POOL_SIZE) || 15,
            },
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                password: process.env.REDIS_PASSWORD || '',
                port: Number.parseInt(process.env.REDIS_PORT) || 6379,
                tls: [1, '1', 'true', true].includes(process.env.REDIS_TLS) || false,
            },
            processorPrefixes: {
                isw: process.env.ISW_TID_PREFIX,
                hydrogen: process.env.HYDROGEN_TID_PREFIX
            },
            zone: {
                baseURL: (_a = process.env.ZONE_BASE_URL) !== null && _a !== void 0 ? _a : "https://zone.cluster.africa",
                fallbackZoneTid: process.env.FALLBACK_ZONE_TID || '2214F5FK'
            },
            ptspId: process.env.PTSP_ID || '',
        };
    }
    getConfig(env) {
        return this.configObject;
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map