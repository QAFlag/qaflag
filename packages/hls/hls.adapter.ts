import { HttpResponse, fetchWithAxios, AdapterInterface } from '@qaflag/core';
import { HlsRequest } from './hls.request';

export class HlsAdapter implements AdapterInterface {
  public async fetch(req: HlsRequest): Promise<HttpResponse> {
    return fetchWithAxios(req);
  }
}
