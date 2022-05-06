import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { AtomContext } from './atom.context';

export class AtomScenario extends ScenarioType({
  name: 'Atom',
}) {
  #context: AtomContext | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get context(): AtomContext | null {
    return this.#context;
  }

  public async __execute() {
    const response = await this.#adapter.fetch(this.request);
    this.#context = new AtomContext(this, response);
    this.#context.statusCode.must.equal(this.statusCode || 200);
  }
}
