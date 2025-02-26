import {Request, Response} from "express"
import { sendSocketMessage, TransactionTypes } from "../helpers/cardsockethelper"

export async function status(req: Request, res: Response){
    try {
        const data = await sendSocketMessage(TransactionTypes.PING, {})

        return res.status(200).json({
            status:'success',
            data
         })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Faile to Perform operation"
        })
    }
}

export async function getConnections(req: Request, res: Response){
    try {
        const [isw,habari,hydrogen] = await Promise.all([
            sendSocketMessage(TransactionTypes.ISW_CONNECTIONS, {}),
            sendSocketMessage(TransactionTypes.HABARI_CONNECTIONS, {}),
            sendSocketMessage(TransactionTypes.HYDROGEN_CONNECTIONS, {}),
        ])

        return res.json({
            isw,
            habari,
            hydrogen
        })
    } catch (error) {
        res.status(400).json({
            message: "Faile to Perform operation"
        })
    }
}

export async function killBridge(req: Request, res: Response){
    try {
        const res = await sendSocketMessage(TransactionTypes.KILL_BRIDGE, {})
    } catch (error) {
        res.status(400).json({
            message: "Faile to Perform operation"
        })
    }
}

export async function closeConnections(req: Request, res: Response){
    try {
        const {connection} = req.body
        const action = {
            'isw': TransactionTypes.ISW_CLOSE_CONNECTIONS,
            'habari': TransactionTypes.HABARI_CLOSE_CONNECTIONS,
            'hydrogen': TransactionTypes.HYDROGEN_CLOSE_CONNECTIONS
        }[connection]

        if(!action){
            return res.status(400).json({
                message: "Invalid Connection name"
             })
        }
        const data = await sendSocketMessage(action, {})

        return res.status(200).json({
            message: "Connection Closed Successfully",
            data
        })
    } catch (error) {
        res.status(400).json({
            message: "Faile to Perform operation"
        })
    }
}