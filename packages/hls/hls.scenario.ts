import { ScenarioType } from '@qaflag/core';
import { HlsAdapter } from './hls.adapter';
import { HlsContext } from './hls.context';
import { HlsRequest } from './hls.request';

export class HlsScenario extends ScenarioType({
  name: 'HLS',
}) {
  #context: HlsContext | null = null;
  #adapter: HlsAdapter = new HlsAdapter();

  public readonly request = new HlsRequest(this.opts);

  public get context(): HlsContext | null {
    return this.#context;
  }

  public async __execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#context = new HlsContext(this, resp);
    this.#context.statusCode.must.be.equalTo(this.statusCode || 200);
  }
}
