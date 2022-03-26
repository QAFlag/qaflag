import needle = require('needle');
import { fetchWithAxios } from '../common/utils/axios';
import { HttpResponse } from '../common/models/http-response';
import { AdapterInterface } from '../common/types/adapter.interface';
import { JsonRequest } from './json.request';

export class JsonAdapter implements AdapterInterface {
  public async fetch(req: JsonRequest): Promise<HttpResponse> {
    return fetchWithAxios(req);
  }
}
