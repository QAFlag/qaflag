import { HttpRequest } from '@qaflag/core';
import { PlaywrightScenario } from './playwright.scenario';

type PlaywrightCookie = {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

export class PlaywrightRequest extends HttpRequest {
  constructor(scenario: PlaywrightScenario) {
    super(scenario.opts, scenario.persona);
  }

  public getCookiesArray(): PlaywrightCookie[] {
    return [];
  }
}
