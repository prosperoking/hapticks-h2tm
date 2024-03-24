import mongoose, {SchemaTypes, ObjectId} from "mongoose";
import { PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

export type ITerminalID = {
    tid : string,
    linkedTo: ObjectId,
    type: 'isw' | 'hydrogen',
    rangeGenerated: string,
    prefix: string,
}

export interface ITerminalIDDocument extends Document, ITerminalID {}

const terminalIDSchema = new mongoose.Schema<ITerminalIDDocument>({
    tid: {
        type: String,
        index: true,
        unique: true,
    },
    prefix: {
        index: true,
        type: String,
        minLength: 4,
        maxlength: 4,
    },
    linkedTo: {
        type : SchemaTypes.ObjectId,
        default: null,
    },
    rangeGenerated: {
        type: String,
        index: true,
        default: null,
    },
    type:  {
        type : String,
        required: true,
        index: true,
    }
},{
    timestamps: true,
    toJSON:{
        virtuals: true,
        versionKey: false,
    }
});

terminalIDSchema.virtual('terminal',{
    localField: 'linkedTo',
    foreignField: '_id',
    justOne: true,
    ref: 'terminal'
});

terminalIDSchema.pre('save',function(){
    this.prefix =  this.tid.substring(0,4);
})

terminalIDSchema.plugin(paginate)

const TerminalID = mongoose.model<ITerminalID, PaginateModel<ITerminalID>>("TerminalId",terminalIDSchema);
export default  TerminalID;