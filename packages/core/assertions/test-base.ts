import { ValueInterface } from '../value/value.interface';
import { AssertionOpts } from './assertion';
import { TestResult } from './result';

export type mustShouldCould = 'must' | 'should' | 'could';

export type TestEvalEnum =
  | 'standard'
  | 'every'
  | 'some'
  | 'only'
  | 'atMost'
  | 'atLeast';

export abstract class TestBase<ValueWrapper extends ValueInterface> {
  public readonly message: string[];
  protected readonly opts: AssertionOpts;

  constructor(
    public readonly input: ValueWrapper,
    protected readonly mustShouldCould: mustShouldCould,
    opts?: AssertionOpts,
    message?: string[],
  ) {
    this.message = message || [input.name, mustShouldCould];
    this.opts = {
      isNot: opts?.isNot ?? false,
      evalType: opts?.evalType ?? 'standard',
      howMany: opts?.howMany ?? 0,
    };
  }

  protected get evalType() {
    return this.opts.evalType;
  }

  protected get isNot() {
    return this.opts.isNot;
  }

  protected result(pass: boolean, statement: string) {
    this.message.push(statement);
    const text = this.message.join(' ');
    if (this.needsResultOutput) {
      this.input.logger.log(
        pass ? 'pass' : this.isOptional ? 'optionalFail' : 'fail',
        { text },
      );
      if (!pass) {
        this.input.logger.log('info', {
          text: `Actual Value: ${this.input.string.$}`,
        });
      }
    }
    return new TestResult(this, pass);
  }

  protected get needsResultOutput(): boolean {
    return this.mustShouldCould !== 'could';
  }

  protected get isOptional(): boolean {
    return this.mustShouldCould !== 'must';
  }

  public get not() {
    this.opts.isNot = !this.opts.isNot;
    this.message.push('not');
    return this;
  }

  public get be() {
    this.message.push('be');
    return this;
  }

  public get match() {
    this.message.push('match');
    return this;
  }

  public get a() {
    this.message.push('a');
    return this;
  }

  public get an() {
    this.message.push('an');
    return this;
  }

  public get have() {
    this.message.push('have');
    return this;
  }

  public get all() {
    this.opts.evalType = 'every';
    this.message.push('all');
    return this;
  }

  public get none() {
    this.opts.evalType = 'some';
    this.opts.isNot = true;
    this.message.push('none');
    return this;
  }

  public get any() {
    this.opts.evalType = 'some';
    this.message.push('any');
    return this;
  }

  public get some() {
    this.opts.evalType = 'some';
    this.message.push('some');
    return this;
  }

  public only(count: number) {
    this.opts.evalType = 'only';
    this.opts.howMany = count;
    this.message.push(`only ${count}`);
    return this;
  }

  public just(count: number) {
    this.opts.evalType = 'only';
    this.opts.howMany = count;
    this.message.push(`just ${count}`);
    return this;
  }

  public atMost(count: number) {
    this.opts.evalType = 'atMost';
    this.opts.howMany = count;
    this.message.push(`at most ${count}`);
    return this;
  }

  public atLeast(count: number) {
    this.opts.evalType = 'atLeast';
    this.opts.howMany = count;
    this.message.push(`at least ${count}`);
    return this;
  }

  public noLessThan(count: number) {
    this.opts.evalType = 'atLeast';
    this.opts.howMany = count;
    this.message.push(`no less than ${count}`);
    return this;
  }

  public moreThan(count: number) {
    this.opts.evalType = 'atLeast';
    this.opts.howMany = count + 1;
    this.message.push(`more than ${count}`);
    return this;
  }

  public noMoreThan(count: number) {
    this.opts.evalType = 'atMost';
    this.opts.howMany = count;
    this.message.push(`no more than ${count}`);
    return this;
  }
}
