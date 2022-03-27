import { HttpResponse, fetchWithAxios, AdapterInterface } from '@qaflag/core';
import { XmlRequest } from './xml.request';

export class XmlAdapter implements AdapterInterface {
  public async fetch(req: XmlRequest): Promise<HttpResponse> {
    req.responseType = 'document';
    return fetchWithAxios(req);
  }
}
