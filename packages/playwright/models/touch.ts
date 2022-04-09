import { PagePosition } from './bounding-box.value';
import { PlaywrightValue } from './playwright.value';

export interface TouchOpts {
  force?: boolean | undefined;
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
  noWaitAfter?: boolean | undefined;
  position?: PagePosition | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
}

export interface DoubleTapOpts extends TouchOpts {
  delayBetweenMs?: number | undefined;
}

export class Touch {
  constructor(private locator: PlaywrightValue) {}

  public async tap(opts?: TouchOpts) {
    this.locator.logger.log('action', `TAP`);
    return this.locator.$.tap(opts);
  }

  public async doubleTap(opts?: DoubleTapOpts) {
    const page = this.locator.$.page();
    await this.locator.$.tap(opts);
    await page.waitForTimeout(opts?.delayBetweenMs || 300);
    await this.locator.$.tap(opts);
  }
}
