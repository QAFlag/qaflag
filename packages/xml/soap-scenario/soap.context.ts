import { HttpResponse } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isSoapValid } from './soap-validation';
import { SoapScenario } from './soap.scenario';

const validMimeTypes = [
  'application/soap+xml',
  'text/xml',
  'text/soap+xml',
  'application/wsdl+xml',
  'text/wsdl+xml',
];

export class SoapContext extends XmlContext<SoapScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    public readonly scenario: SoapScenario,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.header('content-type').must.startWith(validMimeTypes);
    isSoapValid(this).as('Is SOAP valid?').must.be.true();
  }
}
