import Emittery = require('emittery');
import { Persona } from '../models/persona';
import { LogCollector, LogReceiver } from './log-provider.interface';
import { ScenarioInterface } from './scenario.interface';

export interface SuiteStep<ScenarioType> {
  stepNumber: number;
  scenarios: ScenarioType[];
}

export interface SuiteInterface extends LogReceiver, LogCollector {
  title: string;
  steps: SuiteStep<ScenarioInterface>[];
  scenarios: ScenarioInterface[];
  events: Emittery<{ complete: never }>;
  persona: Persona;
  set<T>(key: string, value: T): T;
  get(key: string): any;
  push(key: string, value: any): any;
  execute(): Promise<void>;
}
