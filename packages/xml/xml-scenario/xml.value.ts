import {
  ArrayValue,
  KeyValue,
  NumericValue,
  StringValue,
  ValueAbstract,
} from '@qaflag/core';
import * as cheerio from 'cheerio';

export type CheerioElement = cheerio.Cheerio<cheerio.Node>;

export class XmlValue extends ValueAbstract<CheerioElement> {
  public get length(): NumericValue {
    return this.createNumber(this.$.length, `Length of ${this.name}`);
  }

  public get outer(): StringValue {
    return this.createString(this.toString(), `Outer Markup of ${this.name}`);
  }

  public get string() {
    return this.createString(this.toString(), this.name, this.opts);
  }

  public get text(): StringValue {
    return this.createString(this.$.text(), `Text within ${this.name}`);
  }

  public get contents() {
    return this.createElement(this.$.contents(), `Contents of ${this.name}`);
  }

  public get tagName(): StringValue {
    return this.createString(
      String(this.$.get(0)['tagName']),
      `Tag of ${this.name}`,
    );
  }

  public get first() {
    return this.createElement(this.$.first(), `First in ${this.name}`);
  }

  public get last() {
    return this.createElement(this.$.last(), `Last in ${this.name}`);
  }

  public get parent() {
    return this.createElement(this.$.parent(), `Parent of ${this.name}`);
  }

  public get value() {
    return this.createGeneric(this.$.val(), `Value of ${this.name}`);
  }

  public attribute(name: string) {
    return this.createString(
      this.$.attr(name),
      `Attribute ${name} of ${this.name}`,
    );
  }

  public mapText() {
    const array = this.$.map((i, el) => cheerio.default(el).text()).toArray();
    return new ArrayValue<string>(array, {
      ...this.opts,
      name: `Text of ${this.name}`,
    });
  }

  public mapAttribute(attributeName: string) {
    const array = this.$.map((i, el) =>
      cheerio.default(el).attr(attributeName),
    ).toArray();
    return new ArrayValue<string>(array, {
      ...this.opts,
      name: `Attributes ${attributeName} of ${this.name}`,
    });
  }

  public find(selector: string) {
    const results = this.$.find(selector);
    return new XmlValue(results, {
      name: `${selector} within ${this.name}`,
      logger: this.logger,
    });
  }

  public previousSibling(selector?: string) {
    return this.createElement(
      this.$.prev(selector),
      `Previous Sibling of ${this.name}`,
    );
  }

  public nextSibling(selector?: string) {
    return this.createElement(
      this.$.next(selector),
      `Next Sibling of ${this.name}`,
    );
  }

  public siblings(selector?: string) {
    return this.createElement(
      this.$.siblings(selector),
      `Siblings of ${this.name}`,
    );
  }

  public children(selector?: string) {
    return this.createElement(
      this.$.children(selector),
      `Siblings of ${this.name}`,
    );
  }

  public hasClass(className: string) {
    return this.createBoolean(
      this.$.hasClass(className),
      `${this.name} has class ${className}`,
    );
  }

  public closestAncestor(selector?: string) {
    return this.createElement(
      this.$.closest(selector),
      `Closest ancestor of ${this.name} matching ${selector}`,
    );
  }

  public getDataAttribute(name: string) {
    return this.createGeneric(
      this.$.data(name),
      `Data attribute ${name} in ${this.name}`,
    );
  }

  public nth(index: number) {
    return this.createElement(
      this.$.eq(index),
      `nth(${index}) in ${this.name}`,
    );
  }

  public butNot(selector: string) {
    return this.createElement(
      this.$.not(selector),
      `${this.name} but not ${selector}`,
    );
  }

  public parents(selector?: string) {
    return this.createElement(
      this.$.parents(selector),
      `Parents of ${this.name} that match ${selector}`,
    );
  }

  public parentsUntil(selector?: string) {
    return this.createElement(
      this.$.parentsUntil(selector),
      `Parents of ${this.name} until matches ${selector}`,
    );
  }

  public previousSiblingsUntil(selector?: string) {
    return this.createElement(
      this.$.prevUntil(selector),
      `Previous siblings of ${this.name} until matches ${selector}`,
    );
  }

  public nextSiblingsUntil(selector?: string) {
    return this.createElement(
      this.$.nextUntil(selector),
      `Next siblings of ${this.name} until matches ${selector}`,
    );
  }

  public slice(startIndex: number, endIndex?: number) {
    return this.createElement(
      this.$.slice(startIndex, endIndex),
      `Slice(${startIndex}, ${endIndex}) of ${this.name}`,
    );
  }

  public getProperty(property: string) {
    return this.createString(
      this.$.prop(property),
      `Property ${property} of ${this.name}`,
    );
  }

  public toString(): string {
    return this.$.toString();
  }

  public toArray(): cheerio.Node[] {
    return this.$.toArray();
  }

  protected createElement(
    element: CheerioElement,
    name: string,
    opts?: KeyValue,
  ) {
    return new XmlValue(element, { logger: this.logger, name, ...opts });
  }
}
