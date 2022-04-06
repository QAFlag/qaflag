import { ScenarioType } from '@qaflag/core';
import { PlaywrightAdapter } from './playwright.adapter';
import { PlaywrightRequest } from './playwright.request';
import { PlaywrightContext } from './playwright.context';

export class PlaywrightScenario extends ScenarioType({
  name: 'Playwright',
}) {
  #context: PlaywrightContext | null = null;
  #adapter = new PlaywrightAdapter();

  public readonly request = new PlaywrightRequest(this.opts);

  public get context(): PlaywrightContext | null {
    return this.#context;
  }

  public async execute() {
    const playwright = await this.#adapter.fetch(this.request);
    this.#context = new PlaywrightContext(this, playwright);
  }
}
