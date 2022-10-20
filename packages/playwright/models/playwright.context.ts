import {
  Context,
  ContextInterface,
  ScenarioInterface,
  StringValue,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';
import { PlaywrightValue } from './playwright.value';
import { ClickOpts } from './pointer';
import { WaitForNavigationOpts, WaitForUrlOpts } from './wait-for';

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
      logger: this.logger,
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

  public find(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(this.playwright.page.locator(selector, opts), {
      name: selector,
      logger: this.scenario.logger,
    });
  }

  public async exists(selector: string, opts?: FindOpts) {
    const locator = this.find(selector, opts);
    await locator.must.exist();
    return locator;
  }

  public async visible(selector: string, opts?: FindOpts) {
    return this.exists(`${selector} >> visible=true`, opts);
  }

  public async hidden(selector: string, opts?: FindOpts) {
    return this.exists(`${selector} >> visible=false`, opts);
  }

  public async count(selector: string, opts?: FindOpts) {
    const locator = this.find(selector, opts);
    return locator.count();
  }

  public async title() {
    const title = await this.page.title();
    return this.stringValue(title, 'Page Title');
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
    return this.page.waitForTimeout(millseconds);
  }

  public async click(
    selector: string,
    findOpts?: FindOpts,
    clickOpts?: ClickOpts,
  ) {
    const element = await this.visible(selector, findOpts);
    return element.mouse.click(clickOpts);
  }
}
