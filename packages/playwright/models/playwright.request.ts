import { Persona, RequestType } from '@qaflag/core';
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

export class PlaywrightRequest extends RequestType {
  public persona: Persona;

  constructor(scenario: PlaywrightScenario) {
    super(scenario.opts);
    this.persona = scenario.persona;
  }

  public getCookiesArray(): PlaywrightCookie[] {
    return [];
  }
}
