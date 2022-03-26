import needle = require('needle');
import { HttpResponse } from '../models/http-response';
import {
  CONTENT_TYPE_FORM_MULTIPART,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_XML,
  ENCODING_GZIP,
} from '../types/http.types';
import { RequestInterface } from '../types/request.interface';
import { parseResponseFromNeedle } from './parse-response';

export const getNeedleOptions = (
  req: RequestInterface,
): needle.NeedleOptions => ({
  agent: req.proxyAgent,
  auth: req.auth?.type,
  compressed: req.headers['Accept-Encoding'] === ENCODING_GZIP,
  cookies: req.cookies,
  follow_max: 5,
  follow_set_cookie: false,
  follow_set_referer: false,
  follow_keep_method: false,
  follow_if_same_host: false,
  follow_if_same_protocol: false,
  follow_if_same_location: false,
  headers: req.headers,
  json: req.headers['Content-Type'] === CONTENT_TYPE_JSON,
  multipart: req.headers['Content-Type'] === CONTENT_TYPE_FORM_MULTIPART,
  open_timeout: 10000,
  response_timeout: 10000,
  read_timeout: 10000,
  output: undefined,
  rejectUnauthorized: false,
  username: req.auth?.username,
  password: req.auth?.password,
  decode_response: true,
  parse_response: false,
  parse_cookies: true,
  //uri_modifier: (uri: string) => uri,
  //stream_length: 0,
  //proxy: req.proxy.host,
  //localAddress: '',
});

export const fetchWithNeedle = async (
  req: RequestInterface,
): Promise<HttpResponse> => {
  return new Promise((resolve, reject) => {
    const stream = needle.request(
      req.method,
      req.path || '/',
      req.body || null,
      getNeedleOptions(req),
      (err, resp: needle.NeedleResponse) => {
        if (!err && resp) {
          return resolve(parseResponseFromNeedle(resp));
        }
        reject(err);
      },
    );
  });
};
