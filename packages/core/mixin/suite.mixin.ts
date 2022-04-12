import Emittery = require('emittery');
import {
  ScenarioConstructor,
  ScenarioInitOpts,
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
  type?: ScenarioConstructor;
};

export function Suite(suiteOpts: SuiteOpts) {
  return class SuiteAbstract implements SuiteInterface {
    #befores: string[] = [];
    #afters: string[] = [];

    public readonly title = suiteOpts.title;
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
    public readonly scenarios: ScenarioInterface[] = [];
    public readonly steps: SuiteStep[] = [];
    public readonly persona: Persona =
      suiteOpts.persona || new Persona({ name: 'Default ' });

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
      const scenarioMethods: { [methodName: string]: ScenarioInitOpts } =
        this[ScenarioDefinitions];
      if (scenarioMethods) {
        Object.values(scenarioMethods)
          .sort((a, b) => a.step - b.step)
          .forEach(scenarioOpts => {
            const scenarioConstructor = scenarioOpts.type || suiteOpts.type;
            if (!scenarioConstructor) {
              throw 'No Scenario Type defined. It must be set either in the Scenario decorator in the Suite decorator, as a default.';
            }
            const scenario = this.addScenarioToStep(
              new scenarioConstructor(scenarioOpts, this),
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
            scenario.request.setPersona(await scenario.persona.authenticate());
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

    private getStep(stepNumber: number): SuiteStep {
      // Look for existing step with this number
      const step = this.steps.find(step => step.stepNumber === stepNumber);
      if (step) return step;
      // Create new step
      const newStep: SuiteStep = {
        stepNumber,
        scenarios: [],
      };
      this.steps.push(newStep);
      this.steps.sort((a, b) => a.stepNumber - b.stepNumber);
      return newStep;
    }

    private addScenarioToStep(scenario: ScenarioInterface) {
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
