import axios from 'axios';

export default class Network{

  constructor(timeout = 15 * 1000){
    this.cancelSource = axios.CancelToken.source();
    this.csrf =  document.querySelector("meta[name='csrf-token']").getAttribute('content');
    this.client = axios.create({
      timeout: timeout,
      cancelToken: this.cancelSource.token
    });
    this.client.interceptors.response.use((response) => response, (error) => {
      if(!error.isAxiosError && error.response?.status == 401) window.location.reload();
      return Promise.reject(error);
    });
  }
  
  get(url, params = {}){
    return this.client.get(url, { params: params });
  }

  post(url, params = {}){
    params.authenticity_token = this.csrf;
    return this.client.post(url, params);
  }

  put(url, params = {}){
    params.authenticity_token = this.csrf;
    return this.client.put(url, params);
  }

  delete(url, params = {}){
    params.authenticity_token = this.csrf;
    return this.client.delete(url, { params: params } );
  }

  cancel(message){
    this.cancelSource.cancel(message);
  }

  handleError(response, callback){
    if(axios.isCancel(response)) console.log("Request canceled")
    else if(callback) callback(response);
  }
}