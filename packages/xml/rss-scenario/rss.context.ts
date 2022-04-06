import { HttpResponse, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isRssValid } from './rss-validation';
import { RssScenario } from './rss.scenario';

const validMimeTypes = ['application/rss+xml', 'text/xml', 'text/rss+xml'];

export class RssContext extends XmlContext<RssScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    scenario: RssScenario,
    httpResponse: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, httpResponse);
    this.header('content-type').must.startWith(validMimeTypes);
    isRssValid(this).as('Is RSS valid?').must.be.true();
  }
}
