import { PlaywrightContext } from './playwright.context';
import { PlaywrightValue } from './playwright.value';

export abstract class ValueDevice {
  protected readonly input: PlaywrightValue;

  constructor(input: PlaywrightValue) {
    const name = input.name;
    this.input = input.first.as(name);
  }

  protected get locator() {
    return this.input.$;
  }

  protected get context() {
    return this.input.context as PlaywrightContext;
  }

  protected get logger() {
    return this.input.context.logger;
  }

  protected get page() {
    return this.context.page;
  }
}
