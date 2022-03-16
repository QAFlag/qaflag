import needle = require('needle');
import { HttpResponse } from '../models/http-response';
import {
  CONTENT_TYPE_FORM_MULTIPART,
  CONTENT_TYPE_JSON,
  ENCODING_GZIP,
} from '../types/http.types';
import { RequestInterface } from '../types/request.interface';
import { parseResponseFromNeedle } from './parse-response';

export const getNeedleOptions = (
  req: RequestInterface,
): needle.NeedleOptions => ({
  agent: undefined,
  auth: req.auth?.type,
  compressed: req.headers['Accept-Encoding'] === ENCODING_GZIP,
  cookies: req.cookies,
  follow_max: 5,
  headers: req.headers,
  json: req.headers['Content-Type'] === CONTENT_TYPE_JSON,
  multipart: req.headers['Content-Type'] === CONTENT_TYPE_FORM_MULTIPART,
  open_timeout: 10000,
  output: undefined,
  parse_cookies: true,
  parse_response: false,
  read_timeout: 10000,
  rejectUnauthorized: false,
  username: req.auth?.username,
  password: req.auth?.password,
  user_agent: req.userAgent,
});

export const fetchWithNeedle = async (
  req: RequestInterface,
): Promise<HttpResponse> => {
  return new Promise((resolve, reject) => {
    const stream = needle.request(
      req.method,
      req.path || '/',
      {},
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
