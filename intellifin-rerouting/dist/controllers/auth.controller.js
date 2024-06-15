"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    getUserInfo(request, response) {
        const { id, username, email, role, permissions, imageUrl } = request.user;
        return response.json({ id, username, email, role, permissions, imageUrl });
    }
    logout(request, response) {
        request.logOut((err) => {
            if (err)
                console.log(err);
        });
        return response.json({ message: "done" });
    }
}
exports.default = AuthContoller;
//# sourceMappingURL=auth.controller.js.map