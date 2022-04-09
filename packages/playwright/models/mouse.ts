import { PlaywrightValue } from './playwright.value';

export type ClickOpts = {
  button?: 'left' | 'right' | 'middle' | undefined;
  clickCount?: number | undefined;
  delay?: number | undefined;
  force?: boolean | undefined;
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
};

export class Mouse {
  constructor(private locator: PlaywrightValue) {}

  public async click(opts?: ClickOpts) {
    this.locator.logger.log('action', `CLICK`);
    return this.locator.$.click(opts);
  }
}
