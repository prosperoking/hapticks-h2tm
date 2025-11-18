import * as csv from "fast-csv";
import { Schema } from "mongoose";

interface Options {
    headers : string[],
    alias : { [key: string]: string  },
}

export default function csvExportPlugin(schema: Schema, options: Options) {
    const transformer = (doc)=>{
        return options.headers.reduce((acc, header) => {
            const aliasKey = options.alias[header] || header;
            acc[header] = doc[aliasKey];
            return acc;
        }, {} as { [key: string]: any });
    }

    schema.static('csvTransformStream', function (){
        return csv.format({headers: true}).transform(transformer);
    })
}