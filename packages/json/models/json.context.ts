import * as jmespath from 'jmespath';
import { HttpContext } from '@qaflag/core';
import { JsonData } from '../types/json-data';
import { JsonValue } from './json.value';

export class JsonContext extends HttpContext {
  public get document(): JsonValue {
    return new JsonValue(this.response.data, {
      name: 'JSON Document',
      logger: this,
    });
  }

  public find(selector: string) {
    const results: JsonData = jmespath.search(this.response.data, selector);
    return new JsonValue(results, { name: selector, logger: this });
  }
}
