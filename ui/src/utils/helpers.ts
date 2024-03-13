import { notify } from "@kyvg/vue3-notification";

export function totalPossibleGeneration(start: string, end: string) {
    const availableCharacters: string[] = Array(10).fill(null).map((_,i)=>i.toString()).concat(
        Array(26).fill(null).map((_,i)=>String.fromCharCode(i+65))
    );
    let  ranges:{[key:string]: {start: number, end: number}} =  ['i', 'j', 'k', 'l'].reduce((acc,letter, index)=>{
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
    }, {})
    console.log(ranges)
    return Object.keys(ranges).reduce((accumulator , letter)=>{
        const range = ranges[letter];
        const dif = (range.end - range.start) + 1
        return accumulator?accumulator*dif : dif;
    }, 0 )
}

export async function copyText(val:string){
    try {
      // @ts-ignore
      ! await navigator.permissions.query({name:'clipboard-write'})
      await navigator.clipboard.writeText(val);
    } catch (error) {
      const input = document.createElement('input')
      input.value = val
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    } finally{
      notify({
        title: "Success",
        text: "Copied"
      })
    }
}