import Emittery = require('emittery');
import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { LogProvider } from './log-provider.interface';
import { ScenarioInterface } from './scenario.interface';

export interface SuiteStep<ScenarioType> {
  stepNumber: number;
  scenarios: ScenarioType[];
}

export interface SuiteInterface extends LogProvider {
  title: string;
  steps: SuiteStep<ScenarioInterface>[];
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
  set<T>(key: string, value: T): T;
  get(key: string): any;
  push(key: string, value: any): any;
  execute(): Promise<void>;
}
