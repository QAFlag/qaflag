import { ValueAbstract } from '@qaflag/core';
import { JsonMust } from '../types/json-test.interface';
import { JsonData } from '../types/json-data';
import { JsonAssertion } from './json.assertion';
import * as jmespath from 'jmespath';

export class JsonValue extends ValueAbstract<JsonData> {
  public get must(): JsonMust {
    return new JsonAssertion(this, 'must');
  }

  public get should(): JsonMust {
    return new JsonAssertion(this, 'should');
  }

  public find(selector: string) {
    const results: JsonData = jmespath.search(this.input, selector);
    return new JsonValue(results, { name: selector, logger: this.logger });
  }
}
