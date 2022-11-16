import {
  Context,
  ContextInterface,
  NumberMapValue,
  ScenarioInterface,
  StringValue,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';
import { PlaywrightValue } from './playwright.value';
import { ClickOpts } from './pointer';
import { WaitForNavigationOpts, WaitForUrlOpts } from './wait-for';
import { FindQuery } from '../selectors';
import { PrimarySelector, SubQueries } from '../types';

export type NavigationOpts =
  | {
      timeout?: number | undefined;
      waitUntil?:
        | 'load'
        | 'domcontentloaded'
        | 'networkidle'
        | 'commit'
        | undefined;
    }
  | undefined;

export type FindOpts = {
  has?: Locator;
  hasText?: string | RegExp;
};

export class PlaywrightContext extends Context implements ContextInterface {
  constructor(
    public readonly scenario: ScenarioInterface,
    protected readonly playwright: PlaywrightInstance,
  ) {
    super(scenario);
  }

  public get url() {
    return new StringValue(this.page.url(), {
      name: 'URL',
      context: this,
    });
  }

  public get page() {
    return this.playwright.page;
  }

  public get browser() {
    return this.playwright.browser;
  }

  public get browserContext() {
    return this.playwright.context;
  }

  public get viewportSize(): NumberMapValue<{
    width: number;
    height: number;
  }> {
    const size = this.page.viewportSize();
    return new NumberMapValue(size || { width: 0, height: 0 }, {
      name: 'Viewport Size',
      context: this,
    });
  }

  public locator(selector: string, opts?: FindOpts): PlaywrightValue {
    return new PlaywrightValue(this.playwright.page.locator(selector, opts), {
      ...opts,
      selector,
      name: selector,
      context: this,
    });
  }

  public find(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ): PlaywrightValue {
    if (typeof selector == 'string' && selector.startsWith('$')) {
      const value = this.get(selector.substring(1));
      if (value instanceof PlaywrightValue) return value;
      throw `${selector} was not a valid alias in this context. Must be set as a PlaywrightValue.`;
    }
    const query = FindQuery.process(selector, ...subQueries);
    return new PlaywrightValue(this.playwright.page.locator(query.selector), {
      selector: query.selector,
      name: query.name,
      context: this,
    });
  }

  public async exists(selector: PrimarySelector, ...subQueries: SubQueries[]) {
    const element = this.find(selector, ...subQueries);
    await element.must.exist();
    return element;
  }

  public async waitFor(selector: PrimarySelector, ...subQueries: SubQueries[]) {
    const element = this.find(selector, ...subQueries);
    return element.waitFor();
  }

  public async visible(selector: PrimarySelector, ...subQueries: SubQueries[]) {
    const element = this.find(selector, ...subQueries);
    await element.must.be.visible();
    return element;
  }

  public async scrollTo(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ) {
    const element = this.find(selector, ...subQueries);
    await element.must.be.visible();
    await element.scrollTo();
    return element;
  }

  protected async getClosest(
    selector: string,
    to: PlaywrightValue,
    opts: {
      maxDistance?: number;
      position?: 'above' | 'below' | 'beside';
    } = {},
  ) {
    const elements = await this.find(selector).queryAll();
    const location = await to.boundingBox();
    const name = `Closest ${selector} to ${to.name}`;
    if (elements.length == 0 || !location) {
      throw `Could not find any ${selector} close to ${to.name}`;
    }
    let min: number | null = null;
    let smallestIndex: number | null = null;
    for (let i = 0; i < elements.length; i++) {
      const current = elements[i];
      const currentBox = await current.boundingBox();
      if (!currentBox) continue;
      const distances = [
        !opts.position || opts.position == 'below'
          ? Math.abs(currentBox.top - location.bottom) +
            Math.abs(currentBox.left - location.left)
          : undefined,
        !opts.position || opts.position == 'above'
          ? Math.abs(currentBox.bottom - location.top) +
            Math.abs(currentBox.left - location.left)
          : undefined,
        !opts.position || opts.position == 'beside'
          ? Math.abs(currentBox.top - location.top) +
            Math.abs(currentBox.right - location.left)
          : undefined,
        !opts.position || opts.position == 'beside'
          ? Math.abs(currentBox.top - location.top) +
            Math.abs(currentBox.left - location.right)
          : undefined,
      ].filter(n => !!n) as number[];
      const diff = Math.min(...distances);
      if (
        (!opts?.maxDistance || diff < opts.maxDistance) &&
        (min === null || diff < min)
      ) {
        smallestIndex = i;
        min = diff;
      }
    }
    if (smallestIndex === null) {
      throw `Could not find any ${selector} close to ${to.name}`;
    }
    return elements[smallestIndex].as(name);
  }

  public async title() {
    return this.stringValue(await this.page.title(), 'Page Title');
  }

  public screenshot(opts: PageScreenshotOptions) {
    return this.page.screenshot(opts);
  }

  public reload(opts: NavigationOpts) {
    return this.page.reload(opts);
  }

  public goForward(opts: NavigationOpts) {
    return this.page.goForward(opts);
  }

  public goBack(opts: NavigationOpts) {
    return this.page.goBack(opts);
  }

  public goTo(url: string, opts: NavigationOpts) {
    return this.page.goto(url, opts);
  }

  public waitForNavigation(opts?: WaitForNavigationOpts) {
    return this.page.waitForNavigation(opts);
  }

  public waitForSelector(selector: string) {
    return this.page.waitForSelector(selector);
  }

  public waitForURL(
    url: string | RegExp | ((url: URL) => boolean),
    opts?: WaitForUrlOpts,
  ) {
    return this.page.waitForURL(url, opts);
  }

  public pause(millseconds: number) {
    this.logger.action('PAUSE', undefined, `${millseconds}ms`);
    return this.page.waitForTimeout(millseconds);
  }

  public async click(element: PlaywrightValue, opts: ClickOpts) {
    if (this.persona.hasMouse) await element.mouse.click(opts);
    else if (this.persona.hasTouch) await element.touch.click(opts);
    else if (this.persona.hasRemote) await element.mouse.click(opts);
    else if (this.persona.hasKeyboard) await element.keyboard.press('Enter');
    return element;
  }

  public async resize(size: [width: number, height: number]) {
    return this.page.setViewportSize({ width: size[0], height: size[1] });
  }
}
