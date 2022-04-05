import { HttpResponseInterface } from './http-response.interface';
import { RequestInterface } from './request.interface';

export interface AdapterInterface {
  fetch(request: RequestInterface): Promise<HttpResponseInterface>;
}
