import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { LogProvider } from './log-provider.interface';
import { ScenarioInterface } from './scenario.interface';
import TypedEmitter from 'typed-emitter';

export interface SuiteStep {
  stepNumber: number;
  scenarios: ScenarioInterface[];
}

export type SuiteEvents = {
  beforeAll: () => void;
  beforeEach: (scenario: ScenarioInterface) => void;
  afterEach: (scenario: ScenarioInterface) => void;
  completed: () => void;
  passed: () => void;
  failed: () => void;
};

export interface SuiteInterface extends LogProvider {
  title: string;
  steps: SuiteStep[];
  scenarios: ScenarioInterface[];
  events: TypedEmitter<SuiteEvents>;
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
