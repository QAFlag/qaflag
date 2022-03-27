import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpResponse } from '../models/http-response';
import { HttpBody } from '../types/http.types';
import { RequestInterface } from '../types/request.interface';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export type AxiosRequest = AxiosRequestConfig<HttpBody> & {
  jar?: CookieJar;
};

export const fetchWithAxios = async (
  req: RequestInterface,
): Promise<HttpResponse<HttpBody, AxiosRequest>> => {
  // https://axios-http.com/docs/req_config
  const axiosRequest: AxiosRequest = {
    method: req.method,
    url: req.url.href,
    baseURL: undefined,
    //transformRequest: [(data, headers) => data],
    //transformResponse: [data => data],
    headers: req.headers,
    //params: req.query,
    data: req.data,
    timeout: 10000,
    withCredentials: true,
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
  };
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));
  const response = await client.request(axiosRequest);
  return new HttpResponse(response);
};
