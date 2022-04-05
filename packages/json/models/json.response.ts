import * as jmespath from 'jmespath';
import { ResponseType } from '@qaflag/core';
import { JsonData } from '../types/json-data';
import { JsonValue } from './json.value';

export class JsonResponse<DataType = JsonData> extends ResponseType {
  public get document(): JsonValue {
    return new JsonValue(this.httpResponse.data, {
      name: 'JSON Document',
      logger: this,
    });
  }

  public find(selector: string) {
    const results: JsonData = jmespath.search(this.httpResponse.data, selector);
    return new JsonValue(results, { name: selector, logger: this });
  }
}
