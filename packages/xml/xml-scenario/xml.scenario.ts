import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from './xml.adapter';
import { XmlRequest } from './xml.request';
import { XmlContext } from './xml.context';

export class XmlScenario extends ScenarioType({
  name: 'XML',
}) {
  #context: XmlContext | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts, this.persona);

  public get context(): XmlContext | null {
    return this.#context;
  }

  public async execute() {
    const response = await this.#adapter.fetch(this.request);
    this.#context = new XmlContext(this, response);
    this.#context.statusCode.must.equal(this.statusCode || 200);
  }
}
