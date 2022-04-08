import { ValueAbstract, ValueInterface, ValueOpts } from '@qaflag/core';
import { Locator } from 'playwright';
import { PlayweightAssertion } from './playwright.assertion';
import { FindOpts } from './playwright.context';

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

  public find(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(this.input.locator(selector, opts), {
      ...this.opts,
      name: `${selector} in ${this.name}`,
    });
  }

  public async innerText(opts?: TimeoutOpts) {
    return this.createString(await this.input.innerText(opts), {
      name: `Inner Text of ${this.name}`,
    });
  }

  public async innerHTML(opts?: TimeoutOpts) {
    return this.createString(await this.input.innerHTML(opts), {
      name: `Inner HTML of ${this.name}`,
    });
  }

  public async count() {
    return this.createNumber(await this.input.count(), {
      name: `Count of ${this.name}`,
    });
  }

  public async getAttribute(name: string, opts?: TimeoutOpts) {
    return this.createString(
      (await this.input.getAttribute(name, opts)) || '',
      {
        name: `Attribute ${name} of ${this.name}`,
      },
    );
  }

  public async inputValue(opts?: TimeoutOpts) {
    return this.createString(await this.input.inputValue(opts), {
      name: `Input Value of ${this.name}`,
    });
  }

  public async textContent(opts?: TimeoutOpts) {
    return this.createString((await this.input.textContent(opts)) || '', {
      name: `Text Content of ${this.name}`,
    });
  }

  public async allInnerTexts() {
    return this.createArray(await this.input.allInnerTexts(), {
      name: `Inner Texts of ${this.name}`,
    });
  }

  public async allTextContents() {
    return this.createArray(await this.input.allTextContents(), {
      name: `Text Conents of ${this.name}`,
    });
  }

  public async boundingBox(opts?: TimeoutOpts) {
    this.input.boundingBox(opts);
  }
}
