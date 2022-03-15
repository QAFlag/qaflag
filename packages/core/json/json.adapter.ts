import needle = require('needle');
import { HttpResponse } from '../common/models/http-response';
import { fetchWithNeedle } from '../common/needle/fetch';
import { AdapterInterface } from '../common/types/adapter.interface';
import { JsonRequest } from './json.request';

export class JsonAdapter implements AdapterInterface {
  public async fetch(req: JsonRequest): Promise<HttpResponse> {
    return fetchWithNeedle(req);
  }
}
