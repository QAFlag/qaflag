import { AxiosResponse } from 'axios';
import { Cookie } from 'tough-cookie';
import { HttpHeaders, JsonData, KeyValue } from '../types/general.types';
import { HttpStatus } from '../types/http.types';
import { AxiosRequest } from '../utils/axios';

interface HttpResponseOptions<
  ResponseBodyType,
  RequestType extends AxiosRequest,
> extends AxiosResponse<ResponseBodyType, RequestType> {
  cookies?: KeyValue;
  trailers?: KeyValue;
}

export class HttpResponse<ResponseBodyType = any, RequestType = any> {
  public constructor(
    private response: HttpResponseOptions<ResponseBodyType, RequestType>,
  ) {}

  public get headers(): HttpHeaders {
    return this.response.headers || {};
  }

  public get trailers(): KeyValue {
    return this.response.trailers || {};
  }

  public get cookies(): KeyValue<Cookie> {
    const cookies: KeyValue<Cookie> = {};
    if (!this.response.headers['set-cookie']) return cookies;
    const cookieHeaders = Array.isArray(this.response.headers['set-cookie'])
      ? this.response.headers['set-cookie']
      : [this.response.headers['set-cookie']];
    cookieHeaders
      .map(cookie => Cookie.parse(cookie))
      .forEach(cookie => {
        cookies[cookie.key] = cookie;
      });
    return cookies;
  }

  public get status(): HttpStatus {
    return { code: this.response.status, text: this.response.statusText };
  }

  public get data(): ResponseBodyType {
    return this.response.data;
  }
}
