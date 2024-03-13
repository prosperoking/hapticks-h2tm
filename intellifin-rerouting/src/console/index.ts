import { Command } from 'commander';
import mongoose, { Mongoose } from "mongoose";
import Config from '../config/config';
import Logger from '../helpers/logger';
import Inquirer from 'inquirer'
import User from '../db/models/user.model';
import Terminal from '../db/models/terminal.model';
import { getAvailableTid } from '../helpers/appUtils';
const config = new Config();
const dbConfig = config.getConfig(process.env.NODE_ENV);

/** connection mongodb */
function connectDatabase(): Promise<Mongoose> {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        Logger.log("Connecting to database");
        mongoose.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
            if (err) {
                reject(err);
            }
            else {
                Logger.log(`Connected to mongodb successfully on ${process.env.NODE_ENV}`);
                resolve(mongoose);
            }
        });
    })
}

const cli = new Command();


cli.name('h2tm')
    .description("Simple cli to manage application info")
    .version("0.0.1");

cli.command('user')
    .description('Used to manage application users')
    .argument('create', 'create a user')
    .option('-a, --admin', 'Create an admin user',false)
    .action((str, options) => {
        const self = this;

        connectDatabase().then(async (connection)=>{
            try {
                const result = await Inquirer.prompt([
                    {
                        type: 'input',
                        name: 'username',
                        prefix: "1.",
                        message: "Enter Username:",
                        validate: async (username) => {
                            if(!username.length) return "Invalid Username";
                            const user = await User.findOne({username});
                            if(user) return "Username already exists";
                            return true;
                        }
                    },
                    {
                        type: 'input',
                        name: 'email',
                        prefix: "2.",
                        message: "Enter email:",
                        validate: async (email) => {
                            if(!email.length ||
                                ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                ) return "Invalid email";
                            const user = await User.findOne({email});
                            if(user) return "Email already exists";
                            return true;
                        }
                    },
                    {
                        type: 'input',
                        name: 'fullname',
                        prefix: "1.",
                        message: "Enter Fullname:",
                        validate: async (fullname) => {
                            if(!fullname.length) return "Invalid Username";
                            return true;
                        }
                    },
                    {
                        type: 'password',
                        name: 'password',
                        mask: '*',
                        prefix: "3.",
                        message: "Enter Password:",
                        validate: (value) => {
                            return value.length >= 8? true: false;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        prefix: "4.",
                        message: "Select User role:",
                        choices: [
                            {name: "User", value: 'user'},
                            {name: 'Admin', value: 'admin'}
                        ],
                    },
                ]);

                await User.create(result);
                Logger.log("User created")
            } catch (error) {
                Logger.log(error.message)
            }
            connection.disconnect();
        })
    });

cli.command("tid")
    .description("Generate tid for terminals missing iswiso, hydogen tids")
    .argument("generate","")
    .action((str, options)=>{
        connectDatabase().then(async (connection)=>{
           const terminals = await Terminal.find({
                $or:[
                    { iswISOTID: null },
                    {  hydrogenTID: null },
                ]
            });
            let total = terminals.length;
            let result = await Inquirer.prompt([{
                type: 'confirm',
                name: 'continue',
                prefix: "1.",
                message: `Are you sure to generate ${total} affected TIDs?`,
            }]);

            if (!result.continue) {
                console.log(result)
                 Logger.log("Cancelled")
                 return process.exit(0)
            }
            Logger.log("Total affected terminals: "+ total);
            if(!total) {
                Logger.log("No Terminal is affected");
                process.exit(0)
            }
            const dbSession = await Terminal.startSession()
            await dbSession.withTransaction(async ()=>{
                const allActivities = terminals.map(async (terminal)=>{
                    const [isw, hygdrogen] = await Promise.all([
                        getAvailableTid(terminal.id, 'isw'),
                        getAvailableTid(terminal.id, 'hydrogen'),
                    ])
                    terminal.iswISOTID =  terminal.iswISOTID ?? isw?.tid;
                    terminal.hydrogenTID = terminal.hydrogenTID ?? hygdrogen?.tid;
                    return terminal;
                });
                await Promise.all(allActivities);
                return Terminal.bulkSave(terminals);
            }).then((result)=>{
                 console.log(result)
                 Logger.log(result)
                 dbSession.endSession()
                 Logger.log("Terminal TIDs attached")
             }).catch((error)=>{
                 Logger.log(error)
             }).finally(()=>{
                process.exit(0)
             })
        });
    })


cli.parse();
