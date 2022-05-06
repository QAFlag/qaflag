import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { SoapContext } from './soap.context';

export class SoapScenario extends ScenarioType({
  name: 'SOAP',
}) {
  #context: SoapContext | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get context(): SoapContext | null {
    return this.#context;
  }

  public async __execute() {
    const response = await this.#adapter.fetch(this.request);
    this.#context = new SoapContext(this, response);
    this.#context.statusCode.must.equal(this.statusCode || 200);
  }
}
