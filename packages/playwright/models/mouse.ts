import { Page } from 'playwright';
import { PagePosition } from './bounding-box.value';
import { PlaywrightValue } from './playwright.value';

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

export interface DragOpts {
  force?: boolean | undefined;
  noWaitAfter?: boolean | undefined;
  sourcePosition?: PagePosition | undefined;
  targetPosition?: PagePosition | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
}

export class Mouse {
  constructor(private locator: PlaywrightValue) {}

  public async click(opts?: ClickOpts) {
    this.locator.logger.log('action', `CLICK`);
    return this.locator.$.click(opts);
  }

  public async hover(opts?: HoverOpts) {
    this.locator.logger.log('action', `HOVER`);
    return this.locator.$.hover(opts);
  }

  public async doubleClick(opts?: ClickOpts) {
    this.locator.logger.log('action', `DOUBLECLICK`);
    return this.locator.$.click(opts);
  }

  public async longPress(opts?: LongPressOpts) {
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
    this.locator.logger.log('action', `DRAG`);
    return this.locator.$.dragTo(destination.$, opts);
  }
}
