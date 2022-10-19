import { mustOrShould, Test } from '@qaflag/core';
import { HlsData } from './hls-data';
import { HlsValue } from './hls.value';

export class JsonAssertion extends Test<HlsData> {
  constructor(input: HlsValue, type: mustOrShould) {
    super(input, type);
  }
}
