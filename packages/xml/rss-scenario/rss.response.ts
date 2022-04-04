import { HttpResponse, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlResponse } from '../xml-scenario/xml.response';
import { isRssValid } from './rss-validation';
import { RssScenario } from './rss.scenario';

const validMimeTypes = ['application/rss+xml', 'text/xml', 'text/rss+xml'];

export class RssResponse extends XmlResponse<RssScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    httpResponse: HttpResponse<string, XmlRequest>,
    scenario: RssScenario,
  ) {
    super(httpResponse, scenario);
    this.header('content-type').must.startWith(validMimeTypes);
    isRssValid(this).as('Is RSS valid?').must.be.true();
  }
}
