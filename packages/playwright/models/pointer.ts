import { PointerInterface } from '@qaflag/core';
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

export interface ClickOpts {
  button?: 'left' | 'right' | 'middle' | undefined;
  clickCount?: number | undefined;
  delay?: number | undefined;
  force?: boolean | undefined;
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
  position?: PagePosition | undefined;
}

export interface LongPressOpts {
  button?: 'left' | 'right' | 'middle' | undefined;
  durationMs?: number;
}

export interface HoverOpts {
  force?: boolean | undefined;
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
  position?:
    | {
        x: number;
        y: number;
      }
    | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
}

export interface PointerOpts {
  force?: boolean | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
}

export interface DragOpts {
  force?: boolean | undefined;
  noWaitAfter?: boolean | undefined;
  sourcePosition?: PagePosition | undefined;
  targetPosition?: PagePosition | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
}

export class Mouse implements PointerInterface {
  constructor(protected locator: PlaywrightValue) {}

  public async click(opts?: ClickOpts) {
    this.locator.logger.action('CLICK', this.locator);
    return this.locator.first.$.click(opts);
  }

  public async hover(opts?: HoverOpts) {
    this.locator.logger.action('HOVER', this.locator);
    return this.locator.first.$.hover(opts);
  }

  public async doubleClick(opts?: ClickOpts) {
    this.locator.logger.action('DCLICK', this.locator);
    return this.locator.first.$.dblclick(opts);
  }

  public async longPress(opts?: LongPressOpts) {
    this.locator.logger.action('LONGPRESS', this.locator);
    const page = this.locator.$.page();
    const boundingBox = await this.locator.$.boundingBox();
    if (!boundingBox) return;
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2,
    );
    await page.mouse.down({ button: opts?.button || 'left' });
    await page.waitForTimeout(opts?.durationMs || 1000);
    await page.mouse.up({ button: opts?.button || 'left' });
  }

  public async dragTo(destination: PlaywrightValue, opts?: DragOpts) {
    this.locator.logger.action('DRAG', this.locator, destination.name);
    return this.locator.first.$.dragTo(destination.$, opts);
  }

  public async selectText(opts?: PointerOpts) {
    this.locator.logger.action('SELECT', this.locator);
    return this.locator.first.$.selectText(opts);
  }
}

export class Touch extends Mouse implements PointerInterface {
  public async click(opts?: TouchOpts) {
    this.locator.logger.action('TAP', this.locator);
    return this.locator.first.$.tap(opts);
  }

  public async doubleClick(opts?: DoubleTapOpts) {
    this.locator.logger.action('DTAP', this.locator);
    const page = this.locator.$.page();
    await this.locator.first.$.tap(opts);
    await page.waitForTimeout(opts?.delayBetweenMs || 300);
    await this.locator.first.$.tap(opts);
  }
}
