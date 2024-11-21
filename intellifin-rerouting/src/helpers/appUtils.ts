import { ObjectId } from "mongoose";
import TerminalID from "../db/models/terminalIds.model";
import Crypto from "crypto"
const availableCharacters: string[] = Array(10).fill(null).map((_,i)=>i.toString()).concat(
    Array(26).fill(null).map((_,i)=>String.fromCharCode(i+65))
);

type Ranges = {
    [k:string]:{start:number, end: number}
}
export function generateTidRange(start: string, end: string, prefix: string = '' ): string[] {
    const alphaNum: RegExp = /^[a-zA-Z0-9]+$/;
    if(start.length !== 4 || end.length !== 4) throw Error("Parameters must be of length four");
    if(!alphaNum.test(start) ||  !alphaNum.test(end)) throw Error("Parameters mus be alpha numberic")

    const ranges:Ranges = getRanges(start, end)
    return generateTids(prefix, ranges);
}

export function generateTids(prefix: string = '', ranges: Ranges): string[] {
    const tids: string[] = [];
    for (let i = ranges.i.start; i <= ranges.i.end; i ++) {
        for (let j = ranges.j.start; j <= ranges.j.end; j++) {
            for (let k = ranges.k.start; k <= ranges.k.end; k++) {
                for (let l = ranges.l.start; l <= ranges.l.end; l++) {
                    tids.push(`${prefix}${charForIndex(i)}${charForIndex(j)}${charForIndex(k)}${charForIndex(l)}`);
                }
            }
        }
    }
    return tids;
}

export async function getAvailableTid(id: ObjectId, type: 'isw'|'hydrogen'| 'isw_new') {
    const terminalId = await TerminalID.findOneAndUpdate({linkedTo: null, type},{
        linkedTo: id
    });
    if(!terminalId) return null;
    return terminalId;
}

function charForIndex(index) {
    if (index < 10) {
        return index.toString();
    } else {
        return String.fromCharCode(index + 55);
    }
}

export function getRanges(start: string, end: string) {
    var ranges = {};
    return ['i', 'j', 'k', 'l'].reduce((acc,letter, index)=>{
        const first = availableCharacters.indexOf(start[index]);
        const last  = availableCharacters.indexOf(end[index]);
        if(last < first) throw new Error('Invalid range');
        return {
            ...acc,
            [letter]: {
                start: first,
                end: last
            }
        }
    }, ranges)
}

export function totalPossibleGeneration(ranges: {[key: string]: {start:number, end: number}}): number {
    return Object.keys(ranges).reduce((accumulator , letter)=>{
        const range = ranges[letter];
        const dif = range.end - range.start + 1
        return accumulator?accumulator*dif : dif;
    }, 0 )
}

export function generateTDESKey(bytes: number = 16): string
{
    return Crypto.randomBytes(bytes)
                .toString('hex')
                .toUpperCase();
}