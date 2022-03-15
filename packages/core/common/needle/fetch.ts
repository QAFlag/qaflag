import needle = require('needle');
import { HttpResponse } from '../models/http-response';
import { RequestInterface } from '../types/request.interface';
import { parseResponseFromNeedle } from './parse-response';

export const getNeedleOptions = (
  req: RequestInterface,
): needle.NeedleOptions => ({
  agent: undefined,
  auth: undefined,
  compressed: undefined,
  cookies: undefined,
  follow_max: 5,
  headers: undefined,
  json: false,
  multipart: false,
  open_timeout: 10000,
  output: undefined,
  parse_cookies: true,
  parse_response: false,
  read_timeout: 10000,
  rejectUnauthorized: false,
  username: undefined,
  password: undefined,
  user_agent: 'Flagpole',
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
