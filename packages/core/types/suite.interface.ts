import Emittery = require('emittery');
import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { LogProvider } from './log-provider.interface';
import { ScenarioInterface } from './scenario.interface';

export interface SuiteStep {
  stepNumber: number;
  scenarios: ScenarioInterface[];
}

export interface SuiteInterface extends LogProvider {
  title: string;
  steps: SuiteStep[];
  scenarios: ScenarioInterface[];
  events: Emittery<{
    beforeAll: never;
    beforeEach: ScenarioInterface;
    afterEach: ScenarioInterface;
    completed: never;
    passed: never;
    failed: never;
  }>;
  persona: Persona;
  logger: Logger;
  results: SuiteResults;
  set<T>(key: string, value: T): T;
  get(key: string): any;
  push(key: string, value: any): any;
  execute(): Promise<void>;
}

export type SuiteStatus = 'not started' | 'in progress' | 'pass' | 'fail';

export interface SuiteResults {
  status: SuiteStatus;
  scenarios: {
    passCount: number;
    failCount: number;
  };
  assertions: {
    passCount: number;
    failCount: number;
    optionalFailCount: number;
  };
}
