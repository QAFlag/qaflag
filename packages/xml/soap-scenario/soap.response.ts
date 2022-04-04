import { HttpResponse, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlResponse } from '../xml-scenario/xml.response';
import { isSoapValid } from './soap-validation';
import { SoapScenario } from './soap.scenario';

const validMimeTypes = [
  'application/soap+xml',
  'text/xml',
  'text/soap+xml',
  'application/wsdl+xml',
  'text/wsdl+xml',
];

export class SoapResponse extends XmlResponse<SoapScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    httpResponse: HttpResponse<string, XmlRequest>,
    scenario: SoapScenario,
  ) {
    super(httpResponse, scenario);
    this.header('content-type').must.startWith(validMimeTypes);
    isSoapValid(this).as('Is SOAP valid?').must.be.true();
  }
}
