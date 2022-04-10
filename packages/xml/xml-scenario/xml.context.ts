import { HttpResponse, HttpContext, ScenarioInterface } from '@qaflag/core';
import { XmlValue } from './xml.value';
import { XmlRequest } from './xml.request';
import { XmlScenario } from './xml.scenario';
import * as cheerio from 'cheerio';

export class XmlContext<
  ScenarioType extends ScenarioInterface = XmlScenario,
> extends HttpContext {
  public cheerio: cheerio.CheerioAPI;

  constructor(
    public readonly scenario: ScenarioType,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.cheerio = this.loadCheerio();
  }

  protected loadCheerio() {
    return cheerio.load(
      this.response.data,
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
      logger: this.logger,
    });
  }

  public exists(selector: string) {
    const results = this.find(selector);
    results.must.exist();
    return results;
  }
}
