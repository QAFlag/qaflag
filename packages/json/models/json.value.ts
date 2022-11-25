import { PrimitiveValueAbstract } from '@qaflag/core';
import { JsonData } from '../types/json-data';
import { JsonAssertion } from './json.assertion';
import * as jmespath from 'jmespath';
import { JsonMust } from './json.must';

export class JsonValue extends PrimitiveValueAbstract<JsonData> {
  public get must(): JsonMust {
    return new JsonAssertion(this, 'must');
  }

  public get should(): JsonMust {
    return new JsonAssertion(this, 'should');
  }

  public get could(): JsonMust {
    return new JsonAssertion(this, 'could');
  }

  public find(selector: string) {
    const results: JsonData = jmespath.search(this.input, selector);
    return new JsonValue(results, { name: selector, context: this.context });
  }
}
