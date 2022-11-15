import {
  NumericValue,
  StringMapValue,
  StringValue,
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
import {
  PrimarySelector,
  SubQueries,
  TimeoutOpts,
  PlaywrightMust,
  BoundingBox,
  PlaywrightValueSortBy,
  OrderDirection,
} from '../types';
import { FindQuery } from '../selectors';

export class PlaywrightValue
  extends ValueAbstract<Locator>
  implements ValueInterface<Locator>, UiElementInterface<Locator>
{
  constructor(
    input: Locator,
    protected opts: ValueOpts & { selector: string },
  ) {
    super(input, opts);
  }

  public get selector(): string {
    return this.input['_selector'];
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

  public get could(): PlaywrightMust {
    return new PlaywrightAssertion(this, 'could');
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

  public locator(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(this.input.locator(selector, opts), {
      ...this.opts,
      name: `${selector} in ${this.name}`,
      selector,
    });
  }

  public find(selector: PrimarySelector, ...subQueries: SubQueries[]) {
    const query = FindQuery.process(selector, ...subQueries);
    return new PlaywrightValue(this.input.locator(query.selector), {
      ...this.opts,
      name: `${selector} in ${this.name}`,
    });
  }

  public async visible(): Promise<PlaywrightValue>;
  public async visible(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ): Promise<PlaywrightValue>;
  public async visible(
    selector?: PrimarySelector,
    ...subQueries: SubQueries[]
  ) {
    if (selector === undefined) {
      this.must.exist();
      return this;
    }
    const locator = this.find(selector, ...subQueries);
    await locator.must.be.visible();
    return locator;
  }

  public async exists(): Promise<PlaywrightValue>;
  public async exists(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ): Promise<PlaywrightValue>;
  public async exists(selector?: PrimarySelector, ...subQueries: SubQueries[]) {
    if (selector === undefined) {
      this.must.exist();
      return this;
    }
    const locator = this.find(selector, ...subQueries);
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

  public async boundingBox(opts?: TimeoutOpts): Promise<BoundingBox | null> {
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
    await this.input.focus(opts);
    return this;
  }

  public async scrollTo(opts?: TimeoutOpts) {
    await this.input.scrollIntoViewIfNeeded(opts);
    return this;
  }

  public async parent() {
    return new PlaywrightValue(this.input.locator('xpath=..'), {
      ...this.opts,
      name: `Parent of ${this.name}`,
    });
  }

  public async queryAll(opts?: {
    sort?: [by: PlaywrightValueSortBy, order: OrderDirection];
  }): Promise<PlaywrightValue[]> {
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
    return opts?.sort ? this._sort(locators, opts.sort) : locators;
  }

  public async waitFor(opts?: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
    timeout?: number;
  }) {
    await this.input.waitFor(opts);
    return this;
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

  public getStyle(
    opts?: TimeoutOpts,
  ): Promise<StringMapValue<keyof CSSStyleDeclaration>>;
  public getStyle(property: string, opts?: TimeoutOpts): Promise<StringValue>;
  public async getStyle(
    a?: string | TimeoutOpts,
    b?: TimeoutOpts,
  ): Promise<StringValue | StringMapValue<keyof CSSStyleDeclaration>> {
    const property = typeof a == 'string' ? a : null;
    const opts = typeof a == 'string' ? b : a;
    const styleProperites = await this.first.input.evaluate(
      sel => window.getComputedStyle(sel),
      opts,
    );
    if (property) {
      return new StringValue(styleProperites[property], {
        name: `Style ${property} of ${this.name}`,
        context: this.context,
      });
    }
    const kv: Record<string, string> = {};
    for (let key in styleProperites) {
      if (isNaN(Number(key))) {
        kv[key] = styleProperites[key];
      }
    }
    return new StringMapValue(kv, {
      name: `Style of ${this.name}`,
      context: this.context,
    });
  }

  private async _sort(
    elements: PlaywrightValue[],
    sort: [by: PlaywrightValueSortBy, order: OrderDirection],
  ) {
    const by = sort[0];
    const order = sort[1];
    const boxes = await this._getBoundingBoxes(elements);
    const fieldMap = {
      size: 'area',
      top: 'top',
      left: 'left',
      bottom: 'bottom',
      right: 'right',
    };
    return elements.sort((a, b) => {
      const indexA = elements.indexOf(a);
      const indexB = elements.indexOf(b);
      const valueA: number = boxes[indexA]?.[fieldMap[by]] || 0;
      const valueB: number = boxes[indexB]?.[fieldMap[by]] || 0;
      return order == 'ASC' ? valueA - valueB : valueB - valueA;
    });
  }

  private async _getBoundingBoxes(
    elements: PlaywrightValue[],
  ): Promise<Array<BoundingBox | null>> {
    return Promise.all(elements.map(element => element.boundingBox()));
  }
}
