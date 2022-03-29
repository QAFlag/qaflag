import { HttpResponse, test } from '@qaflag/core';
import * as cheerio from 'cheerio';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlResponse } from '../xml-scenario/xml.response';
import { isHtmlValid } from './html-validation';
import { HtmlScenario } from './html.scenario';
import { HtmlValue } from './html.value';

const validMimeTypes = ['application/xhtml+xml', 'text/html', 'text/html+xml'];

export class HtmlResponse extends XmlResponse<HtmlScenario> {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    httpResponse: HttpResponse<string, XmlRequest>,
    scenario: HtmlScenario,
  ) {
    super(httpResponse, scenario);
    this.header('content-type').test().startsWith(validMimeTypes);
    test(isHtmlValid(this), 'HTML is valid.').equalTo(true);
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
