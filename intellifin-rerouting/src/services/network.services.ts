import axios from "axios";

interface IApiCient {
    sendPostRequest(data: object, headers: object, url: string): any;
    sendGetRequest(header: any, url: string): any;
}

export class ApiClient implements IApiCient {
  
  sendPostRequest(data: any ={}, headers: object, url: string) {

    console.log("endpoint =>", url);
    console.log("headers =>", headers);
    // console.log("data =>", data);
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers,
        })
        .then((response) => { resolve(response.data);})
        .catch((err) => { reject(err.response); 
          console.log('error :: ', err.response?.data);
        });
    });
  }

  sendGetRequest(headers: any, url: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers,
        })
        .then((response) => resolve(response.data))
        .catch((err) => reject(err));
    });
  }
}


