import { ApiClient } from './network.services';
 

interface IWebServices {

    rerouteVasRequest(headers: object, payload: object, endpoint: string): any;

}

class WebServices implements IWebServices {

    private _apiClient: ApiClient;
    private httpHeaders: object;

    constructor() {
        this._apiClient = new ApiClient();
        this.httpHeaders = {
            "Content-Type": 'application/json'
        }
    }
   
    public async rerouteVasRequest(headers: object, payload: object, endpoint: string) 
    {
        this.httpHeaders = { ...this.httpHeaders, ...headers };
        const response: any = await this._apiClient.sendPostRequest(payload, headers, endpoint);
        return response;
    }

    public async lookupVasRequest(headers: object, payload: object, endpoint: string, requestMethod:string) 
    {
        this.httpHeaders = { ...this.httpHeaders, ...headers };
        let response: any;
        if(requestMethod.toUpperCase() == 'GET'){
            response = await this._apiClient.sendGetRequest(headers, endpoint);
        }else {
            response = await this._apiClient.sendPostRequest(payload, headers, endpoint);
        }
        
        return response;
    }

    public async rerouteVasRequestGet(headers: object, endpoint: string) 
    {
        this.httpHeaders = { ...this.httpHeaders, ...headers };
        const response: any = await this._apiClient.sendGetRequest(headers, endpoint);
        return response;
    }

    public async sendNotificationRequest(headers: object, payload: object, endpoint: string) 
    {
        this.httpHeaders = { ...this.httpHeaders, ...headers };
        // console.log('final endpoint:: ',endpoint );
        const response: any = await this._apiClient.sendPostRequest(payload, headers, endpoint);
        console.log("response :: Log->", response);
        return response;
    }



}

export default new WebServices();