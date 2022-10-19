import { HttpContext, HttpResponse } from '@qaflag/core';
import { HlsRequest } from './hls.request';
import { HlsScenario } from './hls.scenario';

export class HlsContext extends HttpContext {
  constructor(
    public readonly scenario: HlsScenario,
    protected readonly response: HttpResponse<string, HlsRequest>,
  ) {
    super(scenario, response);
  }
}
