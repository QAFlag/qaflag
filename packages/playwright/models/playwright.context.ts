import {
  Context,
  ContextInterface,
  humanReadableList,
  ScenarioInterface,
  StringValue,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { Role, RoleOptions } from '../types/role';
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

  public find(selector: string, opts?: FindOpts): PlaywrightValue {
    return new PlaywrightValue(this.playwright.page.locator(selector, opts), {
      name: selector,
      logger: this.scenario.logger,
    });
  }

  public getByAltText(altText: string) {
    return new PlaywrightValue(this.playwright.page.getByAltText(altText), {
      name: `alt=${altText}`,
      logger: this.scenario.logger,
    });
  }

  public getByPlaceholder(placeholderText: string) {
    return new PlaywrightValue(
      this.playwright.page.getByPlaceholder(placeholderText),
      {
        name: `placeholder=${placeholderText}`,
        logger: this.scenario.logger,
      },
    );
  }

  public getByTitle(title: string) {
    return new PlaywrightValue(this.playwright.page.getByTitle(title), {
      name: `title=${title}`,
      logger: this.scenario.logger,
    });
  }

  public getByTestId(testId: string) {
    return new PlaywrightValue(this.playwright.page.getByTestId(testId), {
      name: `testId=${testId}`,
      logger: this.scenario.logger,
    });
  }

  public getByText(text: string, opts?: { exact?: boolean }) {
    return new PlaywrightValue(this.playwright.page.getByText(text, opts), {
      name: `text=${text}`,
      logger: this.scenario.logger,
    });
  }

  public getByRole(role: Role, opts: RoleOptions) {
    return new PlaywrightValue(this.playwright.page.getByRole(role, opts), {
      name: `role=${role}`,
      logger: this.logger,
    });
  }

  public getByXpath(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(
      this.playwright.page.locator(`xpath=${selector}`, opts),
      {
        name: selector,
        logger: this.scenario.logger,
      },
    );
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

  public exists(element: PlaywrightValue): Promise<PlaywrightValue>;
  public exists(selector: string, opts?: FindOpts): Promise<PlaywrightValue>;
  public async exists(
    selector: string | PlaywrightValue,
    opts?: FindOpts,
  ): Promise<PlaywrightValue> {
    const element = await this.findOverload(selector, opts);
    await element.must.exist();
    return element;
  }

  public visible(element: PlaywrightValue): Promise<PlaywrightValue>;
  public visible(selector: string, opts?: FindOpts): Promise<PlaywrightValue>;
  public async visible(
    selector: string | PlaywrightValue,
    opts?: FindOpts,
  ): Promise<PlaywrightValue> {
    const element = await this.findOverload(selector, opts);
    await element.must.be.visible();
    return element;
  }

  public hidden(element: PlaywrightValue): Promise<PlaywrightValue>;
  public hidden(selector: string, opts?: FindOpts): Promise<PlaywrightValue>;
  public async hidden(
    selector: string | PlaywrightValue,
    opts?: FindOpts,
  ): Promise<PlaywrightValue> {
    const element = await this.findOverload(selector, opts);
    await element.must.be.hidden();
    return element;
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

  private async findOverload(
    selector: string | PlaywrightValue,
    opts?: FindOpts,
  ): Promise<PlaywrightValue> {
    return typeof selector == 'string' ? this.find(selector, opts) : selector;
  }
}
