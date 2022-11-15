import { DebugContent } from '../types/log-provider.interface';
import { ContextInterface } from './context.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';
import { LogContent } from '../models/log-message';
import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../value/values';
import { KvStore } from '../models/kv-store';
import { titleize } from '../utils/string';

type TestCase<T = any> = (context?: ContextInterface) => Promise<T>;

export abstract class Context implements ContextInterface {
  public readonly store = new KvStore();
  private testCaseCount = 0;

  constructor(public readonly scenario: ScenarioInterface) {}

  public get persona() {
    return this.scenario.persona;
  }

  public get logger() {
    return this.scenario.logger;
  }

  public debug(messages: DebugContent | DebugContent[]) {
    this.logger.debug(messages);
  }

  public info(messages: string | string[]) {
    this.logger.info(messages);
  }

  public heading(messages: string | string[]) {
    this.logger.heading(messages);
  }

  public fail(content: string | LogContent | LogContent[]) {
    this.logger.fail(content);
  }

  public pass(content: string | LogContent | LogContent[]) {
    this.logger.pass(content);
  }

  public case<T = any>(title: string, testCase: TestCase<T>): Promise<T>;
  public case<T = any>(testCase: TestCase<T>): Promise<T>;
  public async case<T>(a: string | TestCase<T>, b?: TestCase<T>): Promise<T> {
    this.testCaseCount++;
    const testCase = (typeof a == 'string' ? b : a) || (() => {});
    const title = (() => {
      if (typeof a === 'string') return a;
      if (b?.name) return titleize(b.name);
      if (typeof a !== 'string' && a?.name) return titleize(a.name);
      return `Test Case #${this.testCaseCount}`;
    })();
    if (!this.logger.lastLineIsBreak()) {
      this.logger.lineBreak();
    }
    this.logger.heading(title);
    const result = await testCase(this);
    this.logger.lineBreak();
    return result as T;
  }

  public set<T>(key: string, value: T): T {
    return this.store.set(key, value);
  }

  public get<T = any>(key: string): T {
    return this.store.get(key) as T;
  }

  public push<T = any>(key: string, value: T): T[] {
    return this.store.push(key, value);
  }

  protected stringValue(input: string, name: string) {
    return new StringValue(input, {
      name,
      context: this,
    });
  }

  protected numericValue(input: number, name: string) {
    return new NumericValue(input, {
      name,
      context: this,
    });
  }

  protected booleanValue(input: boolean, name: string) {
    return new BooleanValue(input, {
      name,
      context: this,
    });
  }

  protected arrayValue<T>(input: T[], name: string) {
    return new ArrayValue(input, {
      name,
      context: this,
    });
  }
}
