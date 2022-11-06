import { mustShouldCould, Test } from '@qaflag/core';
import { HlsValue } from './hls.value';

export class HlsAssertion extends Test<HlsValue> {
  constructor(input: HlsValue, type: mustShouldCould) {
    super(input, type);
  }
}
