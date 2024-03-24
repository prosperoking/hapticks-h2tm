import mongoose, { ObjectId, PaginateModel, SchemaTypes } from "mongoose";
import paginate from "mongoose-paginate-v2";

export type processorType =
  | "nibss"
  | "kimono"
  | "isw"
  | "hydrogen"
  | "bluesalt";

export type IProcessor = {
  title: string;
  host: string;
  type: processorType;
  port: string;
  key: string;
  kcv: string | null;
  ssl: boolean;
  zpk: string | null;
  mid: string;
  ett: string;
  lastRotate: Date | null;
  rid: string | null;
  oRid: string;
  settlementAccount: string | null;
  mcc: string | null;
  tidPrefix: string;
};

export interface IProcessorDocument extends Document, IProcessor {}

const processorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      set: (title: string) => title.trim().toUpperCase(),
    },
    type: {
      type: String,
      enum: ["nibss", "kimono", "isw", "hydrogen", "bluesalt"],
    },
    host: {
      type: String,
      required: true,
      set: (host: string) => host.trim(),
    },
    port: {
      type: Number,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    ssl: {
      type: Boolean,
      default: false,
    },
    kcv: {
      type: String,
      default: null,
    },
    zpk: {
      type: String,
      default: null,
    },
    mid: {
      type: String,
      required: false,
      default: null,
    },
    ett: {
      type: String,
      default: null,
    },
    lastRotate: {
      type: Date,
      default: null,
    },
    rid: {
      type: String,
      default: null,
    },
    oRid: {
      type: String,
      default: null,
    },
    settlementAccount: {
      type: String,
      default: null,
    },
    mcc: {
      type: String,
      default: null,
    },
    tidPrefix: {
      type: String,
      default: null,
      maxlength: 4,
      minlength: 4,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

processorSchema.plugin(paginate);
export default mongoose.model<IProcessor, PaginateModel<IProcessorDocument>>(
  "processors",
  processorSchema
);
