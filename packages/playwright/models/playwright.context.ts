import { Context, ContextInterface, ScenarioInterface } from '@qaflag/core';
import { Locator } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';
import { PlaywrightValue } from './playwright.value';

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
      logger: this.scenario,
    });
  }

  public async exists(selector: string, opts?: FindOpts) {
    const locator = this.find(selector, opts);
    await locator.must.exist();
    return locator;
  }

  public async close() {
    return this.playwright.browser.close();
  }
}
