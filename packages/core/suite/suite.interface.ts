import { Logger } from '../models/logger';
import { LogProvider } from '../types/log-provider.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';
import TypedEmitter from 'typed-emitter';
import { KvStore } from '../models/kv-store';
import { PersonaInterface } from '../persona/persona.interface';

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

export type SuiteDefaults = {
  baseUrl?: string;
};

export interface SuiteConstructor {
  new (defaults?: SuiteDefaults): SuiteInterface;
}

export interface SuiteInterface extends LogProvider {
  title: string;
  steps: SuiteStep[];
  scenarios: ScenarioInterface[];
  events: TypedEmitter<SuiteEvents>;
  persona: PersonaInterface;
  logger: Logger;
  results: SuiteResults;
  store: KvStore;
  baseUrl: string | undefined;
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
