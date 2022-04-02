import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { HttpVerbsCaseInsensitive } from './http.types';
import { LogProvider } from './log-provider.interface';
import { RequestInterface } from './request.interface';
import { ResponseInterface } from './response.interface';
import { SuiteInterface } from './suite.interface';

export type ScenarioUri = `${HttpVerbsCaseInsensitive} ${string}`;

export interface ScenarioInterface extends LogProvider {
  type: string;
  suite: SuiteInterface;
  request: RequestInterface;
  response: ResponseInterface | null;
  key: string | Symbol;
  title: string;
  description: string;
  uri: ScenarioUri;
  step: number;
  persona: Persona;
  statusCode: number | null;
  status: ScenarioStatus;
  result: ScenarioResult;
  logger: Logger;
  next: (...args: any[]) => Promise<void>;
  execute(): Promise<void>;
}

export type ScenarioStatus = 'not started' | 'in progress' | 'pass' | 'fail';

export interface ScenarioResult {
  status: ScenarioStatus;
  passCount: number;
  failCount: number;
  optionalFailCount: number;
}
