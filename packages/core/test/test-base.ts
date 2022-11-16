import { ValueInterface } from '../value/value.interface';

export type mustShouldCould = 'must' | 'should' | 'could';

export type TestEvalEnum =
  | 'standard'
  | 'every'
  | 'some'
  | 'only'
  | 'atMost'
  | 'atLeast';

export abstract class TestBase {
  protected message: string[];

  constructor(
    protected readonly input: ValueInterface,
    protected readonly mustShouldCould: mustShouldCould,
    protected isNot: boolean = false,
    protected evalType: TestEvalEnum = 'standard',
    protected evalCount: number,
    message?: string[],
  ) {
    this.message = message || [input.name, mustShouldCould];
  }

  protected get needsResultOutput(): boolean {
    return this.mustShouldCould !== 'could';
  }

  protected get isOptional(): boolean {
    return this.mustShouldCould !== 'must';
  }

  public get not() {
    this.isNot = !this.isNot;
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
    this.evalType = 'every';
    this.message.push('all');
    return this;
  }

  public get none() {
    this.evalType = 'some';
    this.isNot = true;
    this.message.push('none');
    return this;
  }

  public get any() {
    this.evalType = 'some';
    this.message.push('any');
    return this;
  }

  public get some() {
    this.evalType = 'some';
    this.message.push('some');
    return this;
  }

  public only(count: number) {
    this.evalType = 'only';
    this.evalCount = count;
    this.message.push(`only ${count}`);
    return this;
  }

  public just(count: number) {
    this.evalType = 'only';
    this.evalCount = count;
    this.message.push(`just ${count}`);
    return this;
  }

  public atMost(count: number) {
    this.evalType = 'atMost';
    this.evalCount = count;
    this.message.push(`at most ${count}`);
    return this;
  }

  public atLeast(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count;
    this.message.push(`at least ${count}`);
    return this;
  }

  public noLessThan(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count;
    this.message.push(`no less than ${count}`);
    return this;
  }

  public moreThan(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count + 1;
    this.message.push(`more than ${count}`);
    return this;
  }

  public noMoreThan(count: number) {
    this.evalType = 'atMost';
    this.evalCount = count;
    this.message.push(`no more than ${count}`);
    return this;
  }
}
