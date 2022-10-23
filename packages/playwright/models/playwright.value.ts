import {
  NumericValue,
  UiElementInterface,
  ValueAbstract,
  ValueInterface,
  ValueOpts,
} from '@qaflag/core';
import { Locator } from 'playwright';
import { Form } from './form';
import { Keyboard } from './keyboard';
import { Mouse, Touch } from './pointer';
import { PlaywrightAssertion } from './playwright.assertion';
import { FindOpts } from './playwright.context';
import { PlaywrightMust } from '../types/playwrite-must';

export interface LocatorOpts extends ValueOpts {
  selector: string;
}

interface TimeoutOpts {
  timeout?: number;
}

export class PlaywrightValue
  extends ValueAbstract<Locator>
  implements ValueInterface<Locator>, UiElementInterface<Locator>
{
  constructor(input: Locator, protected opts: ValueOpts) {
    super(input, opts);
  }

  public get keyboard() {
    return new Keyboard(this);
  }

  public get mouse() {
    return new Mouse(this);
  }

  public get touch() {
    return new Touch(this);
  }

  public get form() {
    return new Form(this);
  }

  public get must(): PlaywrightMust {
    return new PlaywrightAssertion(this, 'must');
  }

  public get should(): PlaywrightMust {
    return new PlaywrightAssertion(this, 'should');
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

  public async exists(): Promise<PlaywrightValue>;
  public async exists(
    selector?: string,
    opts?: FindOpts,
  ): Promise<PlaywrightValue>;
  public async exists(selector?: string, opts?: FindOpts) {
    if (selector === undefined) {
      this.must.exist();
      return this;
    }
    const locator = this.find(selector, opts);
    await locator.must.exist();
    return locator;
  }

  public async text(opts?: TimeoutOpts) {
    return this.createString(await this.input.first().innerText(opts), {
      name: `Inner Text of ${this.name}`,
    });
  }

  public async innerHTML(opts?: TimeoutOpts) {
    return this.createString(await this.input.first().innerHTML(opts), {
      name: `Inner HTML of ${this.name}`,
    });
  }

  public async outerHTML(opts?: TimeoutOpts) {
    return this.createString(
      await this.input.first().evaluate(el => el.outerHTML, opts),
      {
        name: `Inner HTML of ${this.name}`,
      },
    );
  }

  public async tagName(opts?: TimeoutOpts) {
    return this.createString(
      await this.input.first().evaluate(el => el.tagName, opts),
      {
        name: `Tag of ${this.name}`,
      },
    );
  }

  public async classList(opts?: TimeoutOpts) {
    const classList = await this.input
      .first()
      .evaluate(el => el.classList.value.split(' '), opts);
    return this.createArray<string>(classList, {
      name: `Class List of ${this.name}`,
    });
  }

  public async count(): Promise<NumericValue>;
  public async count(selector: string): Promise<NumericValue>;
  public async count(selector?: string) {
    const element = selector ? this.find(selector) : this;
    return this.createNumber(await element.$.count(), {
      name: `Count of ${element.name}`,
    });
  }

  public async attribute(name: string, opts?: TimeoutOpts) {
    return this.createString(
      (await this.input.first().getAttribute(name, opts)) || '',
      {
        name: `Attribute ${name} of ${this.name}`,
      },
    );
  }

  public async value(opts?: TimeoutOpts) {
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
    return this.input.boundingBox(opts);
  }

  public async focus(opts?: TimeoutOpts) {
    return this.input.focus(opts);
  }

  public async scrollTo(opts?: TimeoutOpts) {
    return this.input.scrollIntoViewIfNeeded(opts);
  }

  public async parent() {
    return new PlaywrightValue(this.input.locator('xpath=..'), {
      ...this.opts,
      name: `Parent of ${this.name}`,
    });
  }

  public async queryAll(): Promise<PlaywrightValue[]> {
    const count = await this.input.count();
    const locators: PlaywrightValue[] = [];
    for (let i = 0; i < count; i++) {
      locators.push(
        new PlaywrightValue(this.input.nth(i), {
          ...this.opts,
          name: `${i} in ${this.name}`,
        }),
      );
    }
    return locators;
  }
}
