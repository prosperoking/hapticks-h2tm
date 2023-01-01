import "dotenv/config"

export interface AppConfig {
  [key:string]: any,
  DATABASE_URL: string,
  SECRET_KEY: string,
  DATABASE_HOSTNAME: string,
  DATABASE_PORT: string,
  DATABASE_NAME: string,
  ADMIN_EMAILS: string[],
  enable_logging: boolean,
  options: {
    user: string,
    pass: string,
    keepAlive: boolean,
    keepAliveInitialDelay: number,
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean
  },
  redis: {
    host: string,
    password: string,
    port: number,
    tls: boolean,
  }
}
export default class Config {

        public configObject: AppConfig;
        constructor() {
            this.configObject = {
              DATABASE_URL: process.env.DATABASE_URL,
              SECRET_KEY: process.env.API_SECRET_KEY,
              DATABASE_HOSTNAME: process.env.DB_HOST,
              DATABASE_PORT: process.env.MDB_PORT,
              DATABASE_NAME: process.env.DB_NAME,
              ADMIN_EMAILS: (process.env.ADMIN_EMAILS || '').replace(' ','').split(',') ,
              enable_logging: [1,'1','true',true].includes(process.env.DB_LOGGING),
              options: {
                user: process.env.DB_USERNAME || '',
                pass: process.env.DB_PASSWORD || '',
                keepAlive: true,
                keepAliveInitialDelay: 300000,
                useUnifiedTopology: true,
                useNewUrlParser: true,
              },
              redis: {
                host: process.env.REDIS_HOST || 'localhost',
                password: process.env.REDIS_PASSWORD || '',
                port: Number.parseInt(process.env.REDIS_PORT) || 6379,
                tls: [1,'1','true',true].includes(process.env.REDIS_TLS) || false,
              }
            };
        }

        public getConfig(env: string): AppConfig {
            return this.configObject;
        }
}
