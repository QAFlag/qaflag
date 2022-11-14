import { Must, test, ValueAbstract } from '@qaflag/core';
import { HlsData } from './hls-data';

export class HlsValue extends ValueAbstract<HlsData> {
  public get must(): Must<typeof this> {
    return test(this, 'must');
  }

  public get should(): Must<typeof this> {
    return test(this, 'should');
  }

  public get could(): Must<typeof this> {
    return test(this, 'could');
  }
}
