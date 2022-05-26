import morgan from 'morgan';
import mongoose from "mongoose";
import bodyparser from 'body-parser';
import cors from 'cors';
import timeout from 'connect-timeout';
import express from 'express';
import winston from 'winston';
import Routes from './routes/index.route';
import Config from './config/config';
import Logger from './helpers/logger';
import path from 'path';
import 'dotenv/config';


const app = express();
const port = process.env.PORT || '5009';

/** connection mongodb */
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
const config = new Config();
const dbConfig = config.getConfig(process.env.NODE_ENV);

console.log("connection URL :: ", dbConfig.DATABASE_URL);

mongoose.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
  if (err) Logger.log(err);
  else { Logger.log(`Connected to mongodb successfully on ${process.env.NODE_ENV}`); }
});
mongoose.set('debug', true);
/** Enable Cross Origin Resource Sharing */
app.use(cors());

app.use(timeout('5m'));
/** set parser to parse the request data in json format */
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(morgan(':date *** :method :: :url ** :response-time'));


app.use('/api/v1', Routes);

app.use(express.static(path.join(__dirname,'public')))
app.use('*',express.static(path.join(__dirname,'public')))

app.listen(port, () => {
    //if (err) return console.error(err);
    return console.log(`Server Magic happening on port ${port}`);
});