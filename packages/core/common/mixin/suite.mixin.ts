import Emittery = require('emittery');
import {
  ScenarioConstructor,
  ScenarioTemplate,
} from '../decorators/scenario.decorator';
import { KvStore } from '../models/kv-store';
import { Logger } from '../models/logger';
import { MessageType } from '../types/message.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { SuiteInterface, SuiteStep } from '../types/suite.interface';

export const ScenarioDefinitions = Symbol('ScenarioDefinitions');

export type SuiteOpts = {
  title: string;
};

export function Suite<ScenarioType extends ScenarioInterface>(
  scenarioConstructor: ScenarioConstructor<ScenarioType>,
  initOpts: SuiteOpts,
) {
  return class SuiteAbstract implements SuiteInterface {
    #steps: SuiteStep<ScenarioType>[] = [];
    #scenarios: ScenarioType[] = [];

    public readonly title = initOpts.title;
    public readonly store = new KvStore();
    public readonly logger = new Logger();
    public readonly events = new Emittery();

    public get steps(): SuiteStep<ScenarioType>[] {
      return this.#steps;
    }

    public get scenarios(): ScenarioType[] {
      return this.#scenarios;
    }

    constructor() {
      // Add scenarios to this instance
      const scenarioMethods: { [methodName: string]: ScenarioTemplate } =
        this[ScenarioDefinitions];
      if (scenarioMethods) {
        Object.values(scenarioMethods)
          .sort((a, b) => a.step - b.step)
          .forEach(template => {
            const scenario = this.addScenarioToStep(
              new scenarioConstructor(template, this),
            );
            this.#scenarios.push(scenario);
          });
      }

      // Execute
      setTimeout(async () => {
        await this.execute();
        this.events.emit('complete', this);
      }, 1);
    }

    public async init() {}

    public async execute() {
      for (const step of this.#steps) {
        await Promise.all(
          step.scenarios.map(async scenario => {
            scenario.request.pathReplace(this.store.entries());
            await scenario.execute();
            await scenario.next(scenario);
          }),
        );
      }
    }

    private getStep(stepNumber: number): SuiteStep<ScenarioType> {
      // Look for existing step with this number
      const step = this.#steps.find(step => step.stepNumber === stepNumber);
      if (step) return step;
      // Create new step
      const newStep: SuiteStep<ScenarioType> = {
        stepNumber,
        scenarios: [],
      };
      this.#steps.push(newStep);
      this.#steps.sort((a, b) => a.stepNumber - b.stepNumber);
      return newStep;
    }

    private addScenarioToStep(scenario: ScenarioType) {
      const step = this.getStep(scenario.step);
      step.scenarios.push(scenario);
      return scenario;
    }

    public log(type: MessageType, text: string): void {
      this.logger.log(type, text);
    }

    public set<T>(key: string, value: T): T {
      return this.store.set(key, value);
    }

    public get(key: string): any {
      return this.store.get(key);
    }

    public push(key: string, value: any): any {
      return this.store.push(key, value);
    }
  };
}
