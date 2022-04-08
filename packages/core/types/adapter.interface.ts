import { RequestInterface } from './request-interface';

export interface AdapterInterface {
  fetch(request: RequestInterface): Promise<any>;
}
