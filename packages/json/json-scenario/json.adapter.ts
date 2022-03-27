import { HttpResponse, fetchWithAxios, AdapterInterface } from '@qaflag/core';
import { JsonRequest } from './json.request';

export class JsonAdapter implements AdapterInterface {
  public async fetch(req: JsonRequest): Promise<HttpResponse> {
    return fetchWithAxios(req);
  }
}
