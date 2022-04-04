import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { HtmlResponse } from './html.response';

export class HtmlScenario extends ScenarioType({
  name: 'HTML',
}) {
  #response: HtmlResponse | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get response(): HtmlResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#response = new HtmlResponse(resp, this);
    this.#response.statusCode.must.equal(this.statusCode || 200);
  }
}
