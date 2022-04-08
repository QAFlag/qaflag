import {
  ArrayValue,
  KeyValue,
  NumericValue,
  StringValue,
  test,
  ValueAbstract,
} from '@qaflag/core';
import { Must } from '@qaflag/core/types/test.interface';
import * as cheerio from 'cheerio';

export type CheerioElement = cheerio.Cheerio<cheerio.Node>;

export class XmlValue extends ValueAbstract<CheerioElement> {
  public get must(): Must {
    return test(this, 'must');
  }

  public get should(): Must {
    return test(this, 'should');
  }

  public get length(): NumericValue {
    return this.createNumber(this.$.length, { name: `Length of ${this.name}` });
  }

  public get outer(): StringValue {
    return this.createString(this.toString(), {
      name: `Outer Markup of ${this.name}`,
    });
  }

  public get string() {
    return this.createString(this.toString(), { name: this.name });
  }

  public get text(): StringValue {
    return this.createString(this.$.text(), {
      name: `Text within ${this.name}`,
    });
  }

  public get contents() {
    return this.createElement(this.$.contents(), {
      name: `Contents of ${this.name}`,
    });
  }

  public get tagName(): StringValue {
    return this.createString(String(this.$.get(0)['tagName']), {
      name: `Tag of ${this.name}`,
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

  public get parent() {
    return this.createElement(this.$.parent(), {
      name: `Parent of ${this.name}`,
    });
  }

  public get value() {
    return this.createGeneric(this.$.val(), { name: `Value of ${this.name}` });
  }

  public attribute(name: string) {
    return this.createString(this.$.attr(name) || '', {
      name: `Attribute ${name} of ${this.name}`,
    });
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
    return this.createElement(this.$.prev(selector), {
      name: `Previous Sibling of ${this.name}`,
    });
  }

  public nextSibling(selector?: string) {
    return this.createElement(this.$.next(selector), {
      name: `Next Sibling of ${this.name}`,
    });
  }

  public siblings(selector?: string) {
    return this.createElement(this.$.siblings(selector), {
      name: `Siblings of ${this.name}`,
    });
  }

  public children(selector?: string) {
    return this.createElement(this.$.children(selector), {
      name: `Siblings of ${this.name}`,
    });
  }

  public hasClass(className: string) {
    return this.createBoolean(this.$.hasClass(className), {
      name: `${this.name} has class ${className}`,
    });
  }

  public closestAncestor(selector?: string) {
    return this.createElement(this.$.closest(selector), {
      name: `Closest ancestor of ${this.name} matching ${selector}`,
    });
  }

  public getDataAttribute(name: string) {
    return this.createGeneric(this.$.data(name), {
      name: `Data attribute ${name} in ${this.name}`,
    });
  }

  public nth(index: number) {
    return this.createElement(this.$.eq(index), {
      name: `nth(${index}) in ${this.name}`,
    });
  }

  public butNot(selector: string) {
    return this.createElement(this.$.not(selector), {
      name: `${this.name} but not ${selector}`,
    });
  }

  public parents(selector?: string) {
    return this.createElement(this.$.parents(selector), {
      name: `Parents of ${this.name} that match ${selector}`,
    });
  }

  public parentsUntil(selector?: string) {
    return this.createElement(this.$.parentsUntil(selector), {
      name: `Parents of ${this.name} until matches ${selector}`,
    });
  }

  public previousSiblingsUntil(selector?: string) {
    return this.createElement(this.$.prevUntil(selector), {
      name: `Previous siblings of ${this.name} until matches ${selector}`,
    });
  }

  public nextSiblingsUntil(selector?: string) {
    return this.createElement(this.$.nextUntil(selector), {
      name: `Next siblings of ${this.name} until matches ${selector}`,
    });
  }

  public slice(startIndex: number, endIndex?: number) {
    return this.createElement(this.$.slice(startIndex, endIndex), {
      name: `Slice(${startIndex}, ${endIndex}) of ${this.name}`,
    });
  }

  public getProperty(property: string) {
    return this.createString(this.$.prop(property), {
      name: `Property ${property} of ${this.name}`,
    });
  }

  public toString(): string {
    return this.$.toString();
  }

  public toArray(): cheerio.Node[] {
    return this.$.toArray();
  }

  protected createElement(element: CheerioElement, opts?: KeyValue) {
    return new XmlValue(element, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }
}
