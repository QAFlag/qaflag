import { HttpResponse } from '@qaflag/core';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isSoapValid } from './soap-validation';
import { SoapScenario } from './soap.scenario';
import { XmlValue } from '../xml-scenario/xml.value';

const validMimeTypes = [
  'application/soap+xml',
  'text/xml',
  'text/soap+xml',
  'application/wsdl+xml',
  'text/wsdl+xml',
];

export class SoapContext extends XmlContext<SoapScenario> {
  constructor(
    public readonly scenario: SoapScenario,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.header('content-type').must.startWith(validMimeTypes);
    isSoapValid(this).as('Is SOAP valid?').must.be.true();
  }

  public get body() {
    const root = this.cheerio.root().children()[0];
    const rootName: string = root['name'];
    const rootParts = rootName.split(':');
    const prefix = rootParts.length == 1 ? null : rootParts[0];
    const envTag = prefix === null ? 'Envelope' : `${prefix}\\:Envelope`;
    const bodyTag = prefix === null ? 'Body' : `${prefix}\\:Body`;
    const envelope = this.cheerio(envTag);
    return new XmlValue(envelope.children(bodyTag), {
      logger: this.logger,
      name: 'Body',
    });
  }
}
