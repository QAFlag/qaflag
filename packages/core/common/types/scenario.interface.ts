import { HttpVerbsCaseInsensitive } from './http.types';
import { LogCollector, LogReceiver } from './log-provider.interface';
import { RequestInterface } from './request.interface';
import { ResponseInterface } from './response.interface';
import { SuiteInterface } from './suite.interface';

export type ScenarioUri = `${HttpVerbsCaseInsensitive} ${string}`;

export interface ScenarioInterface extends LogReceiver, LogCollector {
  name: string;
  suite: SuiteInterface;
  request: RequestInterface;
  response: ResponseInterface | null;
  key: string | Symbol;
  description: string;
  uri: ScenarioUri;
  step: number;
  next: (...args: any[]) => Promise<void>;
  execute(): Promise<void>;
}
