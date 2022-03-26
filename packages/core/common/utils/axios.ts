import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { HttpResponse } from '../models/http-response';
import { RequestInterface } from '../types/request.interface';

export const fetchWithAxios = async (
  req: RequestInterface,
): Promise<HttpResponse> => {
  // https://axios-http.com/docs/req_config
  const response = await axios({
    method: req.method,
    url: req.url.href,
    baseURL: undefined,
    //transformRequest: [(data, headers) => data],
    //transformResponse: [data => data],
    headers: req.headers,
    //params: req.query,
    data: req.body,
    timeout: 10000,
    withCredentials: false,
    auth: (() => {
      if (req.auth?.type == 'basic') {
        return req.auth;
      }
    })(),
    responseType: 'json',
    responseEncoding: 'utf8',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: 2000,
    maxBodyLength: 2000,
    validateStatus: status => {
      //return status >= 200 && status < 300; // default
      return true;
    },
    maxRedirects: 5,
    socketPath: null,
    //httpAgent: new http.Agent({ keepAlive: true }),
    //httpsAgent: new https.Agent({ keepAlive: true }),
    proxy: req.proxy,
    decompress: true,
  });
  return parseResponseFromAxios(response);
};

export const parseResponseFromAxios = (response: AxiosResponse<any, any>) =>
  new HttpResponse({
    status: [response.status || 0, response.statusText || ''],
    headers: response.headers,
    body:
      typeof response.data === 'string' ||
      response.headers['content-type']?.includes('image')
        ? response.data
        : response.data.toString('utf8'),
    //cookies: {},
    //trailers: <KeyValue>response.trailers,
    method: response.config.method,
    url: response.config.url || '',
    rawBody: response.data,
  });
