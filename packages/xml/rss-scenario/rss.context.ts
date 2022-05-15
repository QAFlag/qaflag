import { HttpResponse } from '@qaflag/core';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isRssValid } from './rss-validation';
import { RssScenario } from './rss.scenario';

const validMimeTypes = ['application/rss+xml', 'text/xml', 'text/rss+xml'];

export class RssContext extends XmlContext<RssScenario> {
  public get channel() {
    return this.find('channel');
  }

  public get channelLink() {
    return this.find('channel link');
  }

  public get channelTitle() {
    return this.find('channel title');
  }

  public get channelDescription() {
    return this.find('channel description');
  }

  public get items() {
    return this.find('channel item').array.as('Items');
  }

  constructor(
    public readonly scenario: RssScenario,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.header('content-type').must.startWith(validMimeTypes);
    isRssValid(this).as('Is RSS valid?').must.be.true();
  }
}
