import mongoose, {Document} from 'mongoose';
import Journal from '../db/models/vasjournals.model';
import Mappers from '../helpers/mappers';


interface IDBResponse { saved: Boolean, DbrecordInstance: Document };

export interface IDBServices {

    createTransactionRecord(vasData: object, vasProduct: string): Promise<IDBResponse>;
    updateTransactionRecord(vasResponse: object, product): Promise<IDBResponse>;
    updateTransactionStatus(status:boolean, extra:string): Promise<IDBResponse>;

}

class DBServices implements IDBServices {

    private DbrecordInstance: Document;

    constructor() {

        this.DbrecordInstance = null;

    }

    public async createTransactionRecord(data: object, product: string): Promise<IDBResponse> {   
        const dbData = Mappers.mapTransRequestDataToDbSchema(data, product);
        console.log("Formmatted Payload :: ", dbData)
        this.DbrecordInstance = new Journal(dbData);

        let saved = true;
        return await this.DbrecordInstance.save().then((data) => {
            saved = true;
            return { saved, DbrecordInstance: this.DbrecordInstance };


        }).catch((err) => {

             saved = false;
            return { saved, DbrecordInstance: this.DbrecordInstance };

        });



    }

    public async updateTransactionRecord(vasResponse: any, product): Promise<IDBResponse> {
        let saved = true;
        let responseData = Mappers.mapTransResponseDataToDbSchema(vasResponse, product)
        // let vasDataToSave = vasResponse.data ? { ...vasResponse, ...vasResponse.data } : { ...vasResponse };
        let vasDataToSave =  { ...responseData };

        return await this.DbrecordInstance.set(vasDataToSave).save().then(() => {

            saved = true;
            return { saved, DbrecordInstance: this.DbrecordInstance };

        }).catch(() => {

            saved = false;

            return { saved, DbrecordInstance: this.DbrecordInstance };

        });

    }


    public async updateTransactionStatus(status, extraData): Promise<IDBResponse> {
        let saved = true;
        return await this.DbrecordInstance.set({ isCompleted:  status, extraData:extraData }).save().then(() => {

            saved = true;
            return { saved, DbrecordInstance: this.DbrecordInstance };

        }).catch(() => {

            saved = false;

            return { saved, DbrecordInstance: this.DbrecordInstance };

        });

    }



     

}

export default DBServices;