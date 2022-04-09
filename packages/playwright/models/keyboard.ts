import { PlaywrightValue } from './playwright.value';

export type KeyboardOpts = {
  delay?: number | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
};

export class Keyboard {
  constructor(private locator: PlaywrightValue) {}

  public async type(text: string, opts?: KeyboardOpts) {
    this.locator.logger.log('action', `TYPE: ${text}`);
    return this.locator.$.type(text, opts);
  }
}
