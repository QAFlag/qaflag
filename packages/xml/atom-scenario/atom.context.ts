import { HttpResponse } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isValidAtomFeed } from './atom-validation';
import { AtomScenario } from './atom.scenario';

const validMimeTypes = ['application/atom+xml', 'text/xml', 'text/atom+xml'];

export class AtomContext extends XmlContext<AtomScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    scenario: AtomScenario,
    httpResponse: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, httpResponse);
    this.header('content-type').must.startWith(validMimeTypes);
    isValidAtomFeed(this).as('Is valid Atom Feed?').must.be.true();
  }
}
