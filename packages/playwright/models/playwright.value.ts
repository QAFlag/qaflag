import {
  humanReadableList,
  NumericValue,
  UiElementInterface,
  ValueAbstract,
  ValueInterface,
  ValueOpts,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { Form } from './form';
import { Keyboard } from './keyboard';
import { Mouse, Touch } from './pointer';
import { PlaywrightAssertion } from './playwright.assertion';
import { FindOpts } from './playwright.context';
import { PlaywrightMust } from '../types/playwrite-must';
import { TimeoutOpts } from '../types/timeout-opts';
import { Role, RoleOptions } from '../types/role';

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
      await this.input.first().evaluate(el => el.tagName.toUpperCase(), opts),
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
      name: `Value of ${this.name}`,
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
    const box = await this.input.boundingBox(opts);
    if (!box) return null;
    return {
      ...box,
      right: box.x + box.width,
      bottom: box.y + box.height,
      left: box.x,
      top: box.y,
      area: box.height * box.width,
      middleX: Math.round(box.x + box.width * 0.5),
      middleY: Math.round(box.y + box.height * 0.5),
    };
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

  public async waitFor(opts: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
    timeout?: number;
  }) {
    return this.input.waitFor(opts);
  }

  public getByAltText(altText: string) {
    return new PlaywrightValue(this.input.getByAltText(altText), {
      name: `alt=${altText}`,
      logger: this.logger,
    });
  }

  public getByPlaceholder(placeholderText: string) {
    return new PlaywrightValue(this.input.getByPlaceholder(placeholderText), {
      name: `placeholder=${placeholderText}`,
      logger: this.logger,
    });
  }

  public getByTitle(title: string) {
    return new PlaywrightValue(this.input.getByTitle(title), {
      name: `title=${title}`,
      logger: this.logger,
    });
  }

  public getByTestId(testId: string) {
    return new PlaywrightValue(this.input.getByTestId(testId), {
      name: `testId=${testId}`,
      logger: this.logger,
    });
  }

  public getByText(text: string) {
    return new PlaywrightValue(this.input.getByText(text), {
      name: `text=${text}`,
      logger: this.logger,
    });
  }

  public getByRole(role: Role, opts: RoleOptions) {
    return new PlaywrightValue(this.input.getByRole(role, opts), {
      name: `role=${role}`,
      logger: this.logger,
    });
  }

  public getByXpath(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(this.input.locator(`xpath=${selector}`, opts), {
      name: selector,
      logger: this.logger,
    });
  }

  public getByTag(tags: string | string[]) {
    if (Array.isArray(tags)) {
      return this.getByXpath('//' + tags.join(' | //')).as(
        humanReadableList(
          tags.map(tag => `<${tag}>`),
          ',',
          'or',
        ),
      );
    }
    return this.getByXpath(`//${tags}`).as(`<${tags}>`);
  }

  public getByAttribute(attributeName: string, value?: string) {
    return value === undefined
      ? this.getByXpath(`//*[@${attributeName}]`)
      : this.getByXpath(`//*[@${attributeName}=${value}]`);
  }

  public having(has: PlaywrightValue | string | RegExp) {
    const isLocator = has instanceof PlaywrightValue;
    const filtered = this.input.filter({
      has: isLocator ? has.$ : undefined,
      hasText: isLocator ? undefined : has,
    });
    const name = isLocator
      ? `${this.name} having ${has.name}`
      : `${this.name} having text ${has}`;
    return new PlaywrightValue(filtered, {
      name,
      logger: this.logger,
    });
  }

  public async largest(): Promise<PlaywrightValue> {
    const elements = await this.queryAll();
    const name = `Largest ${this.name}`;
    if (!elements.length) {
      throw `Can't get largest, since "${name}" did not exist.`;
    }
    let max = 0;
    let largestIndex = 0;
    for (let i = 0; i < elements.length; i++) {
      const current = elements[i];
      const currentBox = await current.boundingBox();
      const currentSize = currentBox && currentBox.height * currentBox.width;
      if (currentSize && currentSize > max) {
        largestIndex = i;
        max = currentSize;
      }
    }
    return elements[largestIndex].as(name);
  }

  public async smallest(): Promise<PlaywrightValue> {
    const elements = await this.queryAll();
    const name = `Smallest ${this.name}`;
    if (!elements.length) {
      throw `Can't get smallest, since "${name}" did not exist.`;
    }
    let min: number | null = null;
    let smallestIndex = 0;
    for (let i = 0; i < elements.length; i++) {
      const current = elements[i];
      const currentBox = await current.boundingBox();
      const currentSize = currentBox && currentBox.height * currentBox.width;
      if (min === null || (currentSize && currentSize < min)) {
        smallestIndex = i;
        min = currentSize;
      }
    }
    return elements[smallestIndex].as(name);
  }

  public screenshot(opts: PageScreenshotOptions) {
    return this.input.screenshot(opts);
  }
}
