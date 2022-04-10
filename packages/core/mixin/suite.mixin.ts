import Emittery = require('emittery');
import {
  ScenarioConstructor,
  ScenarioTemplate,
} from '../types/scenario.options';
import { KvStore } from '../models/kv-store';
import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { ScenarioInterface } from '../types/scenario.interface';
import { SuiteInterface, SuiteStep } from '../types/suite.interface';

export const ScenarioDefinitions = Symbol('ScenarioDefinitions');
export const BeforeAlls = Symbol('BeforeAlls');
export const AfterAlls = Symbol('AfterAlls');

export type SuiteOpts = {
  title: string;
  persona?: Persona;
};

export function Suite<ScenarioType extends ScenarioInterface>(
  scenarioConstructor: ScenarioConstructor<ScenarioType>,
  initOpts: SuiteOpts,
) {
  return class SuiteAbstract implements SuiteInterface {
    #befores: string[] = [];
    #afters: string[] = [];

    public readonly title = initOpts.title;
    public readonly store = new KvStore();
    public readonly logger = new Logger();
    public readonly events = new Emittery<{
      beforeAll: never;
      beforeEach: ScenarioInterface;
      afterEach: ScenarioInterface;
      completed: never;
      passed: never;
      failed: never;
    }>();
    public readonly scenarios: ScenarioType[] = [];
    public readonly steps: SuiteStep<ScenarioType>[] = [];
    public readonly persona: Persona =
      initOpts.persona || new Persona({ name: 'Default ' });

    constructor() {
      if (this[BeforeAlls]) {
        Object.keys(this[BeforeAlls]).forEach(methodName =>
          this.#befores.push(methodName),
        );
      }
      if (this[AfterAlls]) {
        Object.keys(this[AfterAlls]).forEach(methodName =>
          this.#afters.push(methodName),
        );
      }
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
            this.scenarios.push(scenario);
          });
      }
    }

    public async init() {}

    public async execute() {
      this.logger.start();
      this.events.emit('beforeAll');
      await Promise.all(this.#befores.map(methodName => this[methodName]()));
      for (const step of this.steps) {
        await Promise.all(
          step.scenarios.map(async scenario => {
            this.events.emit('beforeEach', scenario);
            scenario.request = await scenario.persona.authenticate(
              scenario.request,
            );
            scenario.request.pathReplace(this.store.entries());
            scenario.logger.start();
            await scenario.execute();
            await scenario.next(scenario);
            scenario.logger.end();
            await scenario.tearDown();
            this.events.emit('afterEach', scenario);
            this.logger.log(scenario.status == 'pass' ? 'pass' : 'fail', {
              text: scenario.title,
            });
          }),
        );
      }
      await Promise.all(this.#afters.map(methodName => this[methodName]()));
      this.events.emit('completed');
      this.events.emit(this.logger.failed ? 'failed' : 'passed');
      this.logger.end();
    }

    private getStep(stepNumber: number): SuiteStep<ScenarioType> {
      // Look for existing step with this number
      const step = this.steps.find(step => step.stepNumber === stepNumber);
      if (step) return step;
      // Create new step
      const newStep: SuiteStep<ScenarioType> = {
        stepNumber,
        scenarios: [],
      };
      this.steps.push(newStep);
      this.steps.sort((a, b) => a.stepNumber - b.stepNumber);
      return newStep;
    }

    private addScenarioToStep(scenario: ScenarioType) {
      const step = this.getStep(scenario.step);
      step.scenarios.push(scenario);
      return scenario;
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
