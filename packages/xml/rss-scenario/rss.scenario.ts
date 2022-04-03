import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { RssResponse } from './rss.response';

export class RssScenario extends ScenarioType({
  name: 'RSS',
}) {
  #response: RssResponse | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get response(): RssResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#response = new RssResponse(resp, this);
    this.#response.statusCode.is.equalTo(this.statusCode || 200);
  }
}
