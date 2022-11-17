
import { PlaywrightContext } from './playwright.context';
import { PlaywrightValue } from './playwright.value';
  
  export abstract class ValueDevice {
    constructor(protected readonly input: PlaywrightValue) {}
  
    protected get locator() {
      return this.input.first.$;
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
  