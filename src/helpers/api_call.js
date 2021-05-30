import request from 'request'

export class Request {

    apicall = (payload) => {
      return new Promise((resolve, reject) => {
        request(payload, (error, response) => {
          if (error) {
            reject(`The API returned an error: ${error}`);
          } else {
            resolve(response);
          }
        });
      });
    };

    async getRequest(url, headers, params=null){
        
        let EndpointURL = url;
        let paramString = "";
        if(params !== null){
            for (var key in params){
                paramString = `${paramString}${key}=${params[key]}&`;               
            }
            EndpointURL = `${EndpointURL}?${paramString}`;
        }
        const payload = {
            url: EndpointURL,
            method: 'GET',
            json: true,
            headers: headers
        };

        return await this.apicall(payload);

    };

    async postRequest(url, headers, requestBody){
        const payload = {
            url: url,
            method: 'POST',
            json: true,
            headers: headers,
            body: requestBody   
        };

        return await this.apicall(payload);

    };

    async putRequest(url, headers, requestBody){
      const payload = {
        url: url,
        method: 'PUT',
        json: true,
        headers: headers,
        body: requestBody   
      };

      return await this.apicall(payload);
    };

    async deleteRequest(url, headers){
      const payload = {
        url: url,
        method: 'DELETE',
        json: true,
        headers: headers
      };

      return await this.apicall(payload);
    };

}

