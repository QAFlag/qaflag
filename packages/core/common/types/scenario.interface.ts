import { ScenarioUri } from '../types/scenario.types';
import { LogCollector, LogReceiver } from './log-provider.interface';
import { ResponseInterface } from './response.interface';

export interface ScenarioInterface extends LogReceiver, LogCollector {
  name: string;
  response: ResponseInterface | null;
  key: string | Symbol;
  description: string;
  uri: ScenarioUri;
  step: number;
  next: (...args: any[]) => Promise<void>;
  execute(): Promise<void>;
}
