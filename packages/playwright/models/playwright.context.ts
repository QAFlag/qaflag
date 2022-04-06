import { Context, ContextInterface, ScenarioInterface } from '@qaflag/core';
import { Locator } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';

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

  public find(selector: string, opts?: FindOpts) {
    return this.playwright.page.locator(selector, opts);
  }

  public close() {
    return this.playwright.browser.close();
  }
}
