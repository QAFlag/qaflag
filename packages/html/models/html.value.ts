import { KeyValue, UiElementInterface } from '@qaflag/core';
import { CheerioElement, XmlValue } from '@qaflag/xml';

export class HtmlValue
  extends XmlValue
  implements UiElementInterface<CheerioElement>
{
  public find(selector: string) {
    const results = this.$.find(selector);
    return this.createElement(results, {
      name: `${selector} within ${this.name}`,
      logger: this.logger,
    });
  }

  public get first() {
    return this.createElement(this.$.first(), {
      name: `First in ${this.name}`,
    });
  }

  public get last() {
    return this.createElement(this.$.last(), { name: `Last in ${this.name}` });
  }

  public nth(index: number) {
    return this.createElement(this.$.eq(index), {
      name: `nth(${index}) in ${this.name}`,
    });
  }

  public text() {
    return this.createString(this.$.text(), {
      name: `Text within ${this.name}`,
    });
  }

  public attribute(name: string) {
    return this.createString(this.$.attr(name) || '', {
      name: `Attribute ${name} of ${this.name}`,
    });
  }

  public value() {
    const val = this.$.val();
    const opts = { name: `Value of ${this.name}` };
    if (Array.isArray(val)) {
      return this.createArray(
        val.map(item => String(item)),
        opts,
      );
    }
    return this.createString(val || '', opts);
  }

  public tagName() {
    return this.createString(String(this.$.get(0)['tagName']), {
      name: `Tag of ${this.name}`,
    });
  }

  public count() {
    return this.createNumber(this.$.length, { name: `Length of ${this.name}` });
  }

  public getCss(properties: string[] | string) {
    return this.createGeneric(
      this.$.css(Array.isArray(properties) ? properties : [properties]),
      { name: `Style properties of ${this.name} matching ${properties}` },
    );
  }

  protected createElement(element: CheerioElement, opts?: KeyValue) {
    return new HtmlValue(element, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }
}
