import { mustShouldCould, TestBase, TestResult } from '@qaflag/core';
import { PlaywrightMust } from '../types';
import { TimeoutOpts } from '../types/timeout-opts';
import { PlaywrightValue } from './playwright.value';

export type AssertionResult = {
  pass: boolean;
  actualValue?: string | null;
};

export type AwaitedAssertion = (
  data: PlaywrightValue,
) => Promise<AssertionResult> | AssertionResult;
export type mustOrShould = 'must' | 'should';

export class PlaywrightAssertion extends TestBase implements PlaywrightMust {
  constructor(
    public readonly input: PlaywrightValue,
    protected mustShouldCould: mustShouldCould,
    protected isNot: boolean = false,
    protected evalType: 'standard' | 'every' | 'some' = 'standard',
    protected evalCount: number = 0,
    protected message: string[] = [],
  ) {
    super(input, mustShouldCould, isNot, evalType, evalCount, message);
  }

  public get in() {
    this.message.push('in');
    return this;
  }

  protected async execute(assertion: AwaitedAssertion) {
    const result: AssertionResult = await (async () => {
      if (this.evalType === 'standard') {
        return assertion(this.input);
      }
      const arr = await this.input.queryAll();
      const results = await Promise.all(arr.map(item => assertion(item)));
      return {
        pass:
          this.evalType == 'every'
            ? results.every(result => result.pass)
            : results.some(result => result.pass),
        actualValue: results
          .map(result => result.actualValue)
          .filter(actualValue => actualValue !== undefined)
          .join(', '),
      };
    })();
    const pass = this.isNot ? !result.pass : result.pass;
    if (this.needsResultOutput) {
      this.input.logger.log(
        pass ? 'pass' : this.isOptional ? 'optionalFail' : 'fail',
        this.message.join(' '),
      );
      if (!pass && result.actualValue) {
        this.input.logger.log('info', `Actual Value: ${result.actualValue}`);
      }
    }
    return new TestResult(this, result.pass, result.actualValue);
  }

  public async equal(element: PlaywrightValue) {
    this.message.push('equal');
    return this.execute(async input => {
      return {
        pass: this.input === element,
        actualValue: element.name,
      };
    });
  }

  public async visible(opts?: TimeoutOpts) {
    this.message.push('visible');
    return this.execute(async input => {
      const isVisible = await input.$.isVisible(opts);
      return { pass: isVisible, actualValue: isVisible ? 'visible' : 'hidden' };
    });
  }

  public async hidden(opts?: TimeoutOpts) {
    this.message.push('hidden');
    return this.execute(async item => {
      const isHidden = await item.$.isHidden(opts);
      return { pass: isHidden, actualValue: isHidden ? 'hidden' : 'visible' };
    });
  }

  public async checked(opts?: TimeoutOpts) {
    this.message.push('checked');
    return this.execute(async item => {
      const isChecked = await item.$.isChecked(opts);
      return {
        pass: isChecked,
        actualValue: isChecked ? 'checked' : 'unchecked',
      };
    });
  }

  public async editable(opts?: TimeoutOpts) {
    this.message.push('editable');
    return this.execute(async item => {
      const isEditable = await item.$.isEditable(opts);
      return {
        pass: isEditable,
        actualValue: isEditable ? 'editable' : 'not editable',
      };
    });
  }

  public async enabled(opts?: TimeoutOpts) {
    this.message.push('enabled');
    return this.execute(async item => {
      const isEnabled = await item.$.isEnabled(opts);
      return {
        pass: isEnabled,
        actualValue: isEnabled ? 'enabled' : 'disabled',
      };
    });
  }

  public async disabled(opts?: TimeoutOpts) {
    this.message.push('disabled');
    return this.execute(async item => {
      const isDisabled = await item.$.isDisabled(opts);
      return {
        pass: isDisabled,
        actualValue: isDisabled ? 'disabled' : 'enabled',
      };
    });
  }

  public async exist() {
    this.message.push('exist');
    return this.execute(async item => {
      const count = await item.$.count();
      return { pass: count > 0, actualValue: item.$['_selector'] };
    });
  }

  public async className(name: string, opts?: TimeoutOpts) {
    this.message.push(`class ${name}`);
    return this.execute(async item => {
      const classList = await item.classList(opts);
      return {
        pass: classList
          .map(className => className.toUpperCase())
          .$.includes(name.toUpperCase()),
        actualValue: classList.$.join(' '),
      };
    });
  }

  public async tagName(name: string, opts?: TimeoutOpts) {
    this.message.push(`tag <${name.toUpperCase()}>`);
    return this.execute(async item => {
      const tagName = (await item.tagName(opts)).$.toUpperCase();
      return { pass: tagName == name.toUpperCase(), actualValue: tagName };
    });
  }

  public async value(value: string, opts?: TimeoutOpts) {
    this.message.push(`value <${value}>`);
    return this.execute(async item => {
      const elementValue = (await item.form.value(opts)).$;
      return {
        pass: elementValue == value,
        actualValue: elementValue,
      };
    });
  }

  public async attribute(name: string, value: string, opts?: TimeoutOpts) {
    this.message.push(`atribute <${name}>`);
    return this.execute(async item => {
      const attributeValue = (await item.attribute(name, opts)).$;
      return {
        pass: attributeValue == value,
        actualValue: attributeValue,
      };
    });
  }

  public async focus() {
    this.message.push('focus');
    return this.execute(async item => {
      const hasFocus = await item.$.evaluate(
        node => document.activeElement === node,
      );
      return { pass: hasFocus };
    });
  }
}
