import { Request, Response } from 'express';
import ApiResponse from '../helpers/apiResponse';
import { apiStatusCodes } from '../helpers/constants';
import { IUserData } from '../db/models/user.model';


class AuthContoller {

    // public async GetToken(request: Request, response: Response) {

    //     try {

    //         const responseData: any = await VasServices.processAuth(request.headers, request.body);

    //         if(responseData.responseCode !== 0)
    //             return response.status(apiStatusCodes.badRequest).json(responseData);

    //         return response.status(apiStatusCodes.success).json(responseData);

    //     } catch (error) {

    //         return response.status(apiStatusCodes.serverError).json({responseCode: 100, responseMessage: 'An error has occured'});


    //     }

    // }
    // create a function to save session to mongodb

    public getUserInfo(request: Request, response: Response) {
        const { id, username, email, role, permissions, imageUrl } = request.user as IUserData;
        return response.json({ id, username, email, role , permissions, imageUrl  });
    }

    public logout(request: Request, response: Response) {
        request.logOut((err)=>{
            if(err) console.log(err)
        });

        return response.json({message: "done"})
    }
}

export default AuthContoller;