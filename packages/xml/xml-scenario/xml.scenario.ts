import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from './xml.adapter';
import { XmlRequest } from './xml.request';
import { XmlResponse } from './xml.response';

export class XmlScenario extends ScenarioType({
  name: 'XML',
}) {
  #response: XmlResponse | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get response(): XmlResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#response = new XmlResponse(resp, this);
    this.#response.statusCode.must.equal(this.statusCode || 200);
  }
}
