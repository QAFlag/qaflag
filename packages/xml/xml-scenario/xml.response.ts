import { HttpResponse, ResponseType, ScenarioInterface } from '@qaflag/core';
import { XmlValue } from './xml.value';
import { XmlRequest } from './xml.request';
import { XmlScenario } from './xml.scenario';
import * as cheerio from 'cheerio';

export class XmlResponse<
  ScenarioType extends ScenarioInterface = XmlScenario,
> extends ResponseType {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    public httpResponse: HttpResponse<string, XmlRequest>,
    public scenario: ScenarioType,
  ) {
    super(httpResponse, scenario);
    this.cheerio = this.loadCheerio();
  }

  protected loadCheerio() {
    return cheerio.load(
      this.httpResponse.data,
      {
        xmlMode: true,
        xml: {
          xmlMode: true,
          decodeEntities: true,
          withStartIndices: false,
          withEndIndices: false,
          lowerCaseAttributeNames: true,
          lowerCaseTags: true,
          normalizeWhitespace: true,
        },
      },
      false,
    );
  }

  public find(selector: string) {
    const results = this.cheerio(selector);
    return new XmlValue(results, {
      name: selector,
      logger: this,
    });
  }

  public exists(selector: string) {
    const results = this.find(selector);
    results.length.test(`Exists: ${selector}`).greaterThan(0);
    return results;
  }
}
