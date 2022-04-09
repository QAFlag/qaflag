import { ScenarioType } from '@qaflag/core';
import { PlaywrightAdapter } from './playwright.adapter';
import { PlaywrightRequest } from './playwright.request';
import { PlaywrightContext } from './playwright.context';

export class PlaywrightScenario extends ScenarioType({
  name: 'Playwright',
}) {
  #context: PlaywrightContext | null = null;

  public readonly request = new PlaywrightRequest(this);

  public get context(): PlaywrightContext | null {
    return this.#context;
  }

  public async execute() {
    const adapter = new PlaywrightAdapter();
    const playwright = await adapter.fetch(this.request);
    this.#context = new PlaywrightContext(this, playwright);
  }

  public override async tearDown(): Promise<void> {
    return this.context?.close();
  }
}
