import { HttpResponse, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlResponse } from '../xml-scenario/xml.response';
import { isValidAtomFeed } from './atom-validation';
import { AtomScenario } from './atom.scenario';

const validMimeTypes = ['application/atom+xml', 'text/xml', 'text/atom+xml'];

export class AtomResponse extends XmlResponse<AtomScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    httpResponse: HttpResponse<string, XmlRequest>,
    scenario: AtomScenario,
  ) {
    super(httpResponse, scenario);
    this.header('content-type').must.startWith(validMimeTypes);
    isValidAtomFeed(this).as('Is valid Atom Feed?').must.be.true();
  }
}
