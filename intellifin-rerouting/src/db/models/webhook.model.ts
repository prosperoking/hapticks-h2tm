import { Schema, model, SchemaTypes, PaginateModel } from 'mongoose';
import { encrypt, decrypt } from '../../helpers/crypt';
import paginate from 'mongoose-paginate-v2';
import * as mongoose from 'mongoose';
import PTSPProfileModel from './ptspProfile.model';

export interface IWebhookData {
    _id?:  string| any,
    organisationId?: string | any,
    name: string,
    url: string,
    secret: string,
}
export interface IWebhook extends IWebhookData, Document{}

const webhookSchema = new mongoose.Schema<IWebhookData>({
    organisationId:{
        type: SchemaTypes.ObjectId,
        default: null,
    },
    name: {
        type: String,
        required: true,
        set: value=> String(value).toUpperCase(),
    },
    url: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        set: value=> value?.length? encrypt(value): null,
        get: value=> value?.length? decrypt(value): null,
        default: null,
    }
},{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toJSON:{
        getters: true
    }
},);

webhookSchema.virtual('organisation', {
    ref: 'organisationProfile',
    localField: 'organisationId',
    foreignField: '_id',
})

webhookSchema.virtual('request_count',{
    ref: 'webhookRequest',
    localField: '_id',
    foreignField: 'webhookId',
    count: true,
});


webhookSchema.post('remove',function(data){
    PTSPProfileModel.updateMany({
        webhookId: data.id,
    },{
        $set:{
            webhookId: null,
        }
    }).then((result)=>{
        console.log("CLeared Webhook Setting: ",result);
    })
})

webhookSchema.plugin(paginate);

export default mongoose.model<IWebhook, PaginateModel<IWebhook>>('webhooklistener', webhookSchema);