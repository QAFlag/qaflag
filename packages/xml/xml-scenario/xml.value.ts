import { StringValue, ValueAbstract } from '@qaflag/core';
import * as cheerio from 'cheerio';

export class XmlElement extends ValueAbstract<cheerio.Cheerio<cheerio.Node>> {
  public get outer(): StringValue {
    return new StringValue(this.$.html(), {
      name: `Outer Markup of ${this.name}`,
      logger: this.logger,
    });
  }

  public get text(): StringValue {
    return new StringValue(this.$.text(), {
      name: `Text within ${this.name}`,
      logger: this.logger,
    });
  }

  public attribute(name: string) {
    return new StringValue(this.$.attr(name), {
      name: `Attribute ${name} of ${this.name}`,
      logger: this.logger,
    });
  }

  public find(selector: string) {
    const results = this.$.find(selector);
    return new XmlElement(results.eq(0), {
      name: `${selector} within ${this.name}`,
      logger: this.logger,
    });
  }
}
