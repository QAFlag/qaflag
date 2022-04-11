import { HttpRequest } from '@qaflag/core';
import { PlaywrightScenario } from './playwright.scenario';

type SameSite = 'Strict' | 'Lax' | 'None';

interface PlaywrightCookie {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: SameSite;
}

export class PlaywrightRequest extends HttpRequest {
  constructor(scenario: PlaywrightScenario) {
    super(scenario.opts);
  }

  public getCookies(): PlaywrightCookie[] {
    return this.cookies.map(cookie => ({
      name: cookie.key,
      value: cookie.value,
      doamin: cookie.domain || undefined,
      path: cookie.path || undefined,
      expires: cookie.expiryTime(),
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: ['Strict', 'Lax', 'None'].includes(cookie.sameSite)
        ? (cookie.sameSite as SameSite)
        : undefined,
    }));
  }
}
