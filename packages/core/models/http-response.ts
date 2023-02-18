import { AxiosResponse } from 'axios';
import { Cookie } from 'tough-cookie';
import { HttpResponseInterface } from '../types/http-response.interface';
import { KeyValue } from '../types/general.types';
import { HttpHeaders, HttpStatus } from '../types/http.types';
import { HttpRequestInterface } from '../types/http-request.interface';

interface HttpResponseOptions<
  ResponseBodyType,
  RequestType extends HttpRequestInterface,
> extends AxiosResponse<ResponseBodyType, RequestType> {
  cookies?: KeyValue;
  trailers?: KeyValue;
}

export interface ResponseMeta {
  startTime?: number;
  endTime?: number;
}

export class HttpResponse<
  ResponseBodyType = any,
  RequestType extends HttpRequestInterface = any,
> implements HttpResponseInterface
{
  public constructor(
    private response: HttpResponseOptions<ResponseBodyType, RequestType>,
    public readonly meta: ResponseMeta,
  ) {}

  public get duration() {
    if (!this.meta.startTime || !this.meta.endTime) {
      throw 'Start time and end time of request were not set';
    }
    return this.meta.endTime - this.meta.startTime;
  }

  public get headers(): HttpHeaders {
    if (!this.response.headers) return [];
    return Object.entries(this.response.headers).map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(' | ') : value,
    }));
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
        if (cookie !== undefined) cookies[cookie.key] = cookie;
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
