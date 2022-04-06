import { ValueAbstract, ValueInterface, ValueOpts } from '@qaflag/core';
import { Locator } from 'playwright';
import { PlayweightAssertion } from './playwright.assertion';

export interface LocatorOpts extends ValueOpts {
  selector: string;
}

interface TimeoutOpts {
  timeout?: number;
}

export class PlaywrightValue
  extends ValueAbstract<Locator>
  implements ValueInterface<Locator>
{
  constructor(input: Locator, protected opts: LocatorOpts) {
    super(input, opts);
  }

  public get must() {
    return new PlayweightAssertion(this, 'must');
  }

  public get should() {
    return new PlayweightAssertion(this, 'should');
  }

  public get first() {
    return new PlaywrightValue(this.input.first(), {
      ...this.opts,
      name: `First of ${this.name}`,
    });
  }

  public get last() {
    return new PlaywrightValue(this.input.last(), {
      ...this.opts,
      name: `Last of ${this.name}`,
    });
  }

  public nth(i: number) {
    return new PlaywrightValue(this.input.nth(i), {
      ...this.opts,
      name: `${i} in ${this.name}`,
    });
  }

  public async innerText(opts?: TimeoutOpts) {
    const text = await this.input.innerText(opts);
    return this.createString(text, `Inner Text of ${this.name}`);
  }

  public async innerHTML(opts?: TimeoutOpts) {
    const text = await this.input.innerHTML(opts);
    return this.createString(text, `Inner HTML of ${this.name}`);
  }

  public async count() {
    const count = await this.input.count();
    return this.createNumber(count, `Count of ${this.name}`);
  }

  public async getAttribute(name: string, opts?: TimeoutOpts) {
    const value = await this.input.getAttribute(name, opts);
    return this.createString(value, `Attribute ${name} of ${this.name}`);
  }

  public async inputValue(opts?: TimeoutOpts) {
    const value = await this.input.inputValue(opts);
    return this.createString(value, `Input Value of ${this.name}`);
  }

  public async textContent(opts?: TimeoutOpts) {
    const value = await this.input.textContent(opts);
    return this.createString(value, `Text Content of ${this.name}`);
  }

  public async allInnerTexts() {
    const texts = await this.input.allInnerTexts();
    return this.createArray(texts, `Inner Texts of ${this.name}`);
  }

  public async allTextContents() {
    const texts = await this.input.allTextContents();
    return this.createArray(texts, `Text Conents of ${this.name}`);
  }
}
