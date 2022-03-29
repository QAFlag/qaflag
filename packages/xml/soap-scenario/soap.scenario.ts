import { ScenarioType } from '@qaflag/core';
import { XmlAdapter } from '../xml-scenario/xml.adapter';
import { XmlRequest } from '../xml-scenario/xml.request';
import { SoapResponse } from './soap.response';

export class SoapScenario extends ScenarioType({
  name: 'SOAP',
}) {
  #response: SoapResponse | null = null;
  #adapter = new XmlAdapter();

  public readonly request = new XmlRequest(this.opts);

  public get response(): SoapResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.log('info', `Fetched response with status code ${resp.status.code}`);
    this.#response = new SoapResponse(resp, this);
  }
}
