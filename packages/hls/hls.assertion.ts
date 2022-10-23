import { mustOrShould, Test } from '@qaflag/core';
import { HlsValue } from './hls.value';

export class HlsAssertion extends Test<HlsValue> {
  constructor(input: HlsValue, type: mustOrShould) {
    super(input, type);
  }
}
