import {
  Context,
  ContextInterface,
  NumberMapValue,
  ScenarioInterface,
  StringValue,
  XY,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';
import { PlaywrightValue } from './playwright.value';
import { WaitForNavigationOpts, WaitForUrlOpts } from './wait-for';
import {
  AriaRole,
  FindQuery,
  label,
  LabelSelector,
  role,
  RoleSelector,
} from '../selectors';
import { PrimarySelector, SubQueries } from '../types';
import {
  QuoteSelector,
  QAFlag_Alias,
  ElementSelector_Prefix,
} from '../selectors/selector-formats';

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

  public find(role: RoleSelector): PlaywrightValue;
  public find(label: LabelSelector): PlaywrightValue;
  public find(aliasName: QAFlag_Alias): PlaywrightValue;
  public find(
    elementType: ElementSelector_Prefix,
    ...subQueries: SubQueries[]
  ): PlaywrightValue;
  public find(
    quotedText: QuoteSelector,
    ...subQueries: SubQueries[]
  ): PlaywrightValue;
  public find(
    selector: PrimarySelector,
    ...subQueries: SubQueries[]
  ): PlaywrightValue;
  public find(
    selector: PrimarySelector | RoleSelector | LabelSelector,
    ...subQueries: SubQueries[]
  ): PlaywrightValue {
    if (typeof selector == 'string' && selector.startsWith('$')) {
      const value = this.get(selector.substring(1));
      if (value instanceof PlaywrightValue) return value;
      throw `${selector} was not a valid alias in this context. Must be set as a PlaywrightValue.`;
    }
    if (selector instanceof RoleSelector) {
      return new PlaywrightValue(
        this.playwright.page.getByRole(selector.role, selector.filters),
        {
          selector: selector.selector,
          name: selector.name,
          context: this,
        },
      );
    }
    if (selector instanceof LabelSelector) {
      return new PlaywrightValue(
        this.playwright.page.getByLabel(selector.label, selector.filters),
        {
          selector: selector.selector,
          name: selector.name,
          context: this,
        },
      );
    }
    const query = FindQuery.process(selector, ...subQueries);
    return new PlaywrightValue(this.playwright.page.locator(query.selector), {
      selector: query.selector,
      name: query.name,
      context: this,
    });
  }

  public role(
    roleName: AriaRole,
    labelName?: string | RegExp,
  ): PlaywrightValue {
    return this.find(role(roleName, labelName));
  }

  public label(labelName: string | RegExp): PlaywrightValue {
    return this.find(label(labelName));
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

  public async resize(size: [width: number, height: number]) {
    return this.page.setViewportSize({ width: size[0], height: size[1] });
  }

  public scroll(distanceY: number): Promise<void>;
  public scroll(distance: XY): Promise<void>;
  public async scroll(distance: XY | number) {
    if (typeof distance == 'number') return this.page.mouse.wheel(0, distance);
    return this.page.mouse.wheel(...distance);
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

  public scrollToTop(): Promise<void> {
    return this.page.evaluate(() => window.scrollTo(0, 0));
  }

  public scrollToBottom(): Promise<void> {
    return this.page.evaluate(() => {
      const y = document.body.scrollHeight;
      window.scrollTo(0, y);
    });
  }
}
