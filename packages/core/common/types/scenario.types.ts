import { HttpVerbsCaseInsensitive } from './http-methods';
import { ScenarioInterface } from './scenario.interface';

export type ScenarioUri = `${HttpVerbsCaseInsensitive} ${string}`;

export interface ScenarioConstructor<
  ScenarioType extends ScenarioInterface = ScenarioInterface,
> {
  new (opts: ScenarioOpts): ScenarioType;
}

/**
 * Used by the scenario decorator to define required fields
 */
export type ScenarioDecoratorOpts = {
  uri: ScenarioUri;
  description?: string;
  step?: number;
};

/**
 * Used to instantiate the Scenario
 */
export type ScenarioOpts = ScenarioDecoratorOpts & {
  key: string | Symbol;
  description: string;
  uri: ScenarioUri;
  step: number;
  next: (...args: any[]) => Promise<void>;
};
