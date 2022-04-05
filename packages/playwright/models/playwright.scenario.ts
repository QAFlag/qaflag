import { ScenarioType } from '@qaflag/core';
import { PlaywrightAdapter } from './playwright.adapter';
import { PlaywrightRequest } from './playwright.request';
import { PlaywrightResponse } from './playwright.response';

export class PlaywrightScenario extends ScenarioType({
  name: 'Playwright',
}) {
  #response: PlaywrightResponse | null = null;
  #adapter = new PlaywrightAdapter();

  public readonly request = new PlaywrightRequest(this.opts);

  public get response(): PlaywrightResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#response = new PlaywrightResponse(resp, this);
  }
}
