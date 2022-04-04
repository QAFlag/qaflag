import { mustOrShould, Test } from '@qaflag/core';
import { JsonData } from '../types/json-data';
import { JsonValue } from './json.value';

export class JsonTest extends Test<JsonData> {
  constructor(input: JsonValue, type: mustOrShould) {
    super(input, type);
  }
}
