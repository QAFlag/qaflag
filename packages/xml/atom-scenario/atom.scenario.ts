import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { AtomResponse } from './atom.response';

export class AtomScenario extends ScenarioType({
  name: 'Atom',
}) {
  #response: AtomResponse | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get response(): AtomResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.log('info', `Fetched response with status code ${resp.status.code}`);
    this.#response = new AtomResponse(resp, this);
  }
}
