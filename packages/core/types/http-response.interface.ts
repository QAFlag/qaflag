import { Cookie } from 'tough-cookie';
import { KeyValue } from './general.types';
import { HttpHeaders, HttpStatus } from './http.types';

export interface HttpResponseInterface {
  duration: number;
  headers: HttpHeaders;
  trailers: KeyValue;
  cookies: KeyValue<Cookie>;
  status: HttpStatus;
  data: any;
}
