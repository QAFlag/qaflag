import { Must, test, ValueAbstract } from '@qaflag/core';
import { HlsData } from './hls-data';

export class HlsValue extends ValueAbstract<HlsData> {
  public get must(): Must {
    return test(this, 'must');
  }

  public get should(): Must {
    return test(this, 'should');
  }

  public get could(): Must {
    return test(this, 'could');
  }
}
