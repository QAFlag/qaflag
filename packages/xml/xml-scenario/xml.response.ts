import { HttpResponse, ResponseType } from '@qaflag/core';
import { XmlValue } from './xml.value';
import { XmlRequest } from './xml.request';
import { XmlScenario } from './xml.scenario';
import * as cheerio from 'cheerio';

export class XmlResponse extends ResponseType({
  name: 'XML Response',
}) {
  public body: cheerio.CheerioAPI;

  constructor(
    httpResponse: HttpResponse<string, XmlRequest>,
    scenario: XmlScenario,
  ) {
    super(httpResponse, scenario);
    this.body = cheerio.load(
      httpResponse.data,
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
    const results = this.body(selector);
    return new XmlValue(results, {
      name: selector,
      logger: this,
    });
  }
}
