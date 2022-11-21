import { PagePosition } from './bounding-box.value';
import { PlaywrightValue } from './playwright.value';
import { ValueDevice } from './value-device';

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

export class Mouse extends ValueDevice {
  public async click(opts?: ClickOpts) {
    this.logger.action('CLICK', this.input);
    await this.locator.click(opts);
    return this.input;
  }

  public async hover(opts?: HoverOpts) {
    this.logger.action('HOVER', this.input);
    await this.locator.hover(opts);
    return this.input;
  }

  public async doubleClick(opts?: ClickOpts) {
    this.logger.action('DCLICK', this.input);
    await this.locator.dblclick(opts);
    return this.input;
  }

  public async tripleClick(opts?: ClickOpts) {
    this.logger.action('TCLICK', this.input);
    await this.locator.click({
      ...opts,
      clickCount: 3,
    });
    return this.input;
  }

  public async longPress(opts?: LongPressOpts) {
    this.logger.action('LONGPRESS', this.input);
    const boundingBox = await this.input.$.boundingBox();
    if (!boundingBox) return;
    await this.page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2,
    );
    await this.page.mouse.down({ button: opts?.button || 'left' });
    await this.page.waitForTimeout(opts?.durationMs || 1000);
    await this.page.mouse.up({ button: opts?.button || 'left' });
    return this.input;
  }

  public async dragTo(destination: PlaywrightValue, opts?: DragOpts) {
    this.logger.action('DRAG', this.input, destination.name);
    await this.locator.dragTo(destination.$, opts);
    return this.input;
  }

  public async selectText(opts?: PointerOpts) {
    this.logger.action('SELECT', this.input);
    await this.locator.selectText(opts);
    return this.input;
  }
}

export class Touch extends Mouse {
  public async click(opts?: TouchOpts) {
    this.logger.action('TAP', this.input);
    await this.locator.tap(opts);
    return this.input;
  }

  public async doubleClick(opts?: DoubleTapOpts) {
    this.logger.action('DTAP', this.input);
    const page = this.input.$.page();
    await this.locator.tap(opts);
    await page.waitForTimeout(opts?.delayBetweenMs || 300);
    await this.locator.tap(opts);
    return this.input;
  }
}
