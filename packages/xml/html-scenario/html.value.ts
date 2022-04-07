import { KeyValue } from '@qaflag/core';
import { CheerioElement, XmlValue } from '../xml-scenario/xml.value';

export class HtmlValue extends XmlValue {
  public getCss(properties: string[] | string) {
    return this.createGeneric(
      this.$.css(Array.isArray(properties) ? properties : [properties]),
      { name: `Style properties of ${this.name} matching ${properties}` },
    );
  }

  protected createElement(element: CheerioElement, opts?: KeyValue) {
    return new HtmlValue(element, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }
}
