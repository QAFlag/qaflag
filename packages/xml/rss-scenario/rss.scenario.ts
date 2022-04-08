import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { RssContext } from './rss.context';

export class RssScenario extends ScenarioType({
  name: 'RSS',
}) {
  #context: RssContext | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts, this.persona);

  public get context(): RssContext | null {
    return this.#context;
  }

  public async execute() {
    const response = await this.#adapter.fetch(this.request);
    this.#context = new RssContext(this, response);
    this.#context.statusCode.must.equal(this.statusCode || 200);
  }
}
