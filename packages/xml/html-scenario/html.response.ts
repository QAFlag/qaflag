import { HttpResponse, ResponseType, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { isHtmlValid } from './html-validation';
import { HtmlScenario } from './html.scenario';
import { HtmlValue } from './html.value';

const validMimeTypes = ['application/xhtml+xml', 'text/html', 'text/html+xml'];

export class HtmlResponse extends ResponseType {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    public httpResponse: HttpResponse<string, XmlRequest>,
    public scenario: HtmlScenario,
  ) {
    super(httpResponse, scenario);
    this.cheerio = this.loadCheerio();
    this.header('content-type').must.startWith(validMimeTypes);
    isHtmlValid(this).as('Is HTML valid?').must.be.true();
  }

  protected loadCheerio() {
    return cheerio.load(
      this.httpResponse.data,
      {
        lowerCaseAttributeNames: true,
        lowerCaseTags: true,
        recognizeCDATA: true,
        recognizeSelfClosing: true,
        decodeEntities: true,
        scriptingEnabled: true,
        xmlMode: false,
        xml: false,
        sourceCodeLocationInfo: true,
        withEndIndices: true,
        withStartIndices: true,
      },
      false,
    );
  }

  public find(selector: string) {
    const results = this.cheerio(selector);
    return new HtmlValue(results, {
      name: selector,
      logger: this,
    });
  }
}
