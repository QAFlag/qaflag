import { Logger } from '../models/logger';
import { HttpVerbsCaseInsensitive } from '../types/http.types';
import { LogProvider } from '../types/log-provider.interface';
import { ContextInterface } from '../context/context.interface';
import { SuiteInterface } from '../suite/suite.interface';
import { RequestInterface } from '../types/request-interface';
import { PersonaInterface } from '../persona/persona.interface';

export type ScenarioUri = `${HttpVerbsCaseInsensitive} ${string}`;

export interface ScenarioInterface extends LogProvider {
  type: string;
  suite: SuiteInterface;
  request: RequestInterface;
  context: ContextInterface | null;
  key: string | Symbol;
  title: string;
  description: string;
  uri: ScenarioUri;
  step: number;
  persona: PersonaInterface;
  statusCode: number | null;
  status: ScenarioStatus;
  result: ScenarioResult;
  logger: Logger;
  __next: (...args: any[]) => Promise<void>;
  __startUp(): Promise<void>;
  __execute(): Promise<void>;
  __tearDown(): Promise<void>;
}

export type ScenarioStatus = 'not started' | 'in progress' | 'pass' | 'fail';

export interface ScenarioResult {
  status: ScenarioStatus;
  passCount: number;
  failCount: number;
  optionalFailCount: number;
}
