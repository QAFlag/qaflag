import needle = require('needle');
import { HttpResponse } from '../models/http-response';
import { HttpHeaders, KeyValue } from '../types/general.types';
import { HttpVerbs, HttpVerbsEnum } from '../types/http.types';

export const parseResponseFromNeedle = (response: needle.NeedleResponse) =>
  new HttpResponse({
    status: [response.statusCode || 0, response.statusMessage || ''],
    headers: <HttpHeaders>response.headers,
    body:
      typeof response.body === 'string' ||
      response.headers['content-type']?.includes('image')
        ? response.body
        : response.body.toString('utf8'),
    cookies: response.cookies ? <KeyValue>response.cookies : {},
    trailers: <KeyValue>response.trailers,
    method: (HttpVerbsEnum.includes(response.method as HttpVerbs)
      ? response.method
      : 'get') as HttpVerbs,
    url: response.url || '',
    rawBody: response.raw,
  });
