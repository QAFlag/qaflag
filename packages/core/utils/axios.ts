import axios, { AxiosRequestConfig } from 'axios';
import { HttpResponse, ResponseMeta } from '../models/http-response';
import { HttpBody } from '../types/http.types';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { AxiosMock } from './axios-mock';
import { HttpRequestInterface } from '../types/http-request.interface';
import FormData = require('form-data');

export const Mock = new AxiosMock(axios);

export type AxiosRequest = AxiosRequestConfig<HttpBody> & {
  jar?: CookieJar;
};

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

export const fetchWithAxios = async (
  req: HttpRequestInterface,
): Promise<HttpResponse<HttpBody, AxiosRequest>> => {
  // https://axios-http.com/docs/req_config
  const axiosRequest: AxiosRequest = {
    method: req.method,
    url: req.url.href,
    baseURL: req.baseUrl,
    //transformRequest: [(data, headers) => data],
    //transformResponse: [data => data],
    headers: (() => {
      const out = {};
      const bearerToken = req.bearerToken || req.persona?.bearerToken;
      if (bearerToken) {
        out['Authorization'] = `Bearer ${bearerToken}`;
      }
      req.headers.forEach(header => {
        out[header.key] = header.value;
      });
      if (req.data instanceof FormData) {
        return { ...out, ...req.data.getHeaders() };
      }
      return out;
    })(),
    params: req.queryString,
    data: req.data,
    timeout: req.timeout,
    withCredentials: true,
    auth: req.auth,
    responseType: req.responseType,
    responseEncoding: req.responseEncoding,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: 500000,
    maxBodyLength: 500000,
    validateStatus: status => {
      //return status >= 200 && status < 300; // default
      return true;
    },
    maxRedirects: req.maxRedirects,
    socketPath: null,
    //httpAgent: new http.Agent({ keepAlive: true }),
    //httpsAgent: new https.Agent({ keepAlive: true }),
    proxy: req.proxy,
    decompress: true,
  };
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));
  const meta: ResponseMeta = {};
  client.interceptors.request.use(
    config => {
      meta.startTime = Date.now();
      return config;
    },
    error => (meta.startTime = Date.now()),
  );
  client.interceptors.response.use(
    response => {
      meta.endTime = Date.now();
      return response;
    },
    error => (meta.endTime = Date.now()),
  );
  const response = await client.request(axiosRequest);
  return new HttpResponse(response, meta);
};
