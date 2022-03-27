import { HttpResponse } from '../models/http-response';
import { RequestInterface } from './request.interface';

export interface AdapterInterface {
  fetch(request: RequestInterface): Promise<HttpResponse>;
}
