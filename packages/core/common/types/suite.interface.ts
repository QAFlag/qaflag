import { LogCollector, LogReceiver } from './log-provider.interface';

export interface SuiteInterface extends LogReceiver, LogCollector {
  set<T>(key: string, value: T): T;
  get(key: string): any;
  push(key: string, value: any): any;
}
