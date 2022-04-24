import { HttpResponse } from '@qaflag/core';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isRssValid } from './rss-validation';
import { RssScenario } from './rss.scenario';

const validMimeTypes = ['application/rss+xml', 'text/xml', 'text/rss+xml'];

export class RssContext extends XmlContext<RssScenario> {
  constructor(
    public readonly scenario: RssScenario,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.header('content-type').must.startWith(validMimeTypes);
    isRssValid(this).as('Is RSS valid?').must.be.true();
  }
}
