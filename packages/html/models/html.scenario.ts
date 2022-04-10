import { ScenarioType } from '@qaflag/core';
import { XmlAdapter, XmlRequest } from '@qaflag/xml';
import { HtmlContext } from './html.context';

export class HtmlScenario extends ScenarioType({
  name: 'HTML',
}) {
  #context: HtmlContext | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts, this.persona);

  public get context(): HtmlContext | null {
    return this.#context;
  }

  public async execute() {
    const response = await this.#adapter.fetch(this.request);
    this.#context = new HtmlContext(this, response);
    this.#context.statusCode.must.equal(this.statusCode || 200);
  }
}
