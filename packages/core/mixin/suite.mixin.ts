import {
  ScenarioConstructor,
  ScenarioInitOpts,
} from '../types/scenario.options';
import { KvStore } from '../models/kv-store';
import { Logger } from '../models/logger';
import { Persona } from '../models/persona';
import { ScenarioInterface } from '../types/scenario.interface';
import {
  SuiteDefaults,
  SuiteEvents,
  SuiteInterface,
  SuiteResults,
  SuiteStep,
} from '../types/suite.interface';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';

export const ScenarioDefinitions = Symbol('ScenarioDefinitions');
export const BeforeAlls = Symbol('BeforeAlls');
export const AfterAlls = Symbol('AfterAlls');

export type SuiteOpts = {
  title: string;
  persona?: Persona;
  type?: ScenarioConstructor;
  baseUrl?: string;
};

export function Suite(suiteOpts: SuiteOpts) {
  return class SuiteAbstract implements SuiteInterface {
    #befores: string[] = [];
    #afters: string[] = [];

    public readonly title = suiteOpts.title;
    public readonly store = new KvStore();
    public readonly logger = new Logger();

    public readonly events = new EventEmitter() as TypedEmitter<SuiteEvents>;
    public readonly scenarios: ScenarioInterface[] = [];
    public readonly steps: SuiteStep[] = [];
    public readonly persona: Persona =
      suiteOpts.persona || new Persona({ name: 'Default ' });
    public readonly baseUrl: string | undefined;

    public get defaultScenarioOpts() {
      return {
        baseUrl: this.baseUrl,
      };
    }

    constructor(public readonly defaultOpts: SuiteDefaults = {}) {
      this.baseUrl = suiteOpts.baseUrl || defaultOpts.baseUrl;
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
              new scenarioConstructor(
                {
                  ...this.defaultScenarioOpts,
                  ...scenarioOpts,
                },
                this,
              ),
            );
            this.scenarios.push(scenario);
          });
      }
    }

    public async execute() {
      this.logger.start();
      this.events.emit('beforeAll');
      await Promise.all(this.#befores.map(methodName => this[methodName]()));
      for (const step of this.steps) {
        await Promise.all(
          step.scenarios.map(async scenario => {
            this.events.emit('beforeEach', scenario);
            await scenario.startUp();
            await scenario.execute();
            await scenario.next(scenario);
            await scenario.tearDown();
            this.events.emit('afterEach', scenario);
            this.logger.log(scenario.status == 'pass' ? 'pass' : 'fail', {
              text: scenario.title,
            });
          }),
        );
      }
      await Promise.all(this.#afters.map(methodName => this[methodName]()));
      this.logger.end();
      this.events.emit('completed');
      this.events.emit(this.logger.failed ? 'failed' : 'passed');
    }

    public getStep(stepNumber: number): SuiteStep {
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

    public addScenarioToStep(scenario: ScenarioInterface) {
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

    public get results() {
      const results: SuiteResults = {
        status: 'pass',
        assertions: {
          passCount: 0,
          failCount: 0,
          optionalFailCount: 0,
        },
        scenarios: {
          passCount: 0,
          failCount: 0,
        },
      };
      this.scenarios.forEach(scenario => {
        const scenarioResult = scenario.result;
        results.assertions.passCount += scenarioResult.passCount;
        results.assertions.failCount += scenarioResult.failCount;
        results.assertions.optionalFailCount +=
          scenarioResult.optionalFailCount;
        if (scenarioResult.failCount > 0) {
          results.status = 'fail';
          results.scenarios.failCount++;
        } else {
          results.scenarios.passCount++;
        }
      });
      return results;
    }
  };
}
