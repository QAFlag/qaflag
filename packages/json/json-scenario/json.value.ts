import { ValueAbstract } from '@qaflag/core';
import { JsonMust } from '../types/json-test.interface';
import { JsonData } from '../types/json-data';
import { JsonTest } from './json.test';

export class JsonValue extends ValueAbstract<JsonData> {
  public get must(): JsonMust {
    return new JsonTest(this, 'must');
  }

  public get should(): JsonMust {
    return new JsonTest(this, 'should');
  }
}
