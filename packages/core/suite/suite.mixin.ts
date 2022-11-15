import {
  ScenarioConstructor,
  ScenarioInitOpts,
} from '../scenario/scenario.options';
import { KvStore } from '../models/kv-store';
import { Logger } from '../models/logger';
import { ScenarioInterface } from '../scenario/scenario.interface';
import {
  SuiteDefaults,
  SuiteEvents,
  SuiteInterface,
  SuiteResults,
  SuiteStep,
} from './suite.interface';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { PersonaInterface } from '../persona/persona.interface';
import { DefaultUser } from '../persona/persona';
import { BeforeSymbol } from '../decorators/before.decorator';
import { AfterSymbol } from '../decorators/after.decorator';

export const ScenarioDefinitions = Symbol('ScenarioDefinitions');
export const CaseDefinitions = Symbol('CaseDefinitions');

export type SuiteOpts = {
  title: string;
  persona?: PersonaInterface;
  type?: ScenarioConstructor;
  baseUrl?: string;
};

export function Suite(suiteOpts: SuiteOpts) {
  return class SuiteAbstract implements SuiteInterface {
    public readonly title = suiteOpts.title;
    public readonly store = new KvStore();
    public readonly logger = new Logger();

    public readonly events = new EventEmitter() as TypedEmitter<SuiteEvents>;
    public readonly scenarios: ScenarioInterface[] = [];
    public readonly steps: SuiteStep[] = [];
    public readonly persona: PersonaInterface =
      suiteOpts.persona || new DefaultUser();
    public readonly baseUrl: string | undefined;

    public get defaultScenarioOpts() {
      return {
        baseUrl: this.baseUrl,
      };
    }

    public get befores() {
      return Object.entries<Function>(this[BeforeSymbol] || {});
    }

    public get afters() {
      return Object.entries<Function>(this[AfterSymbol] || {});
    }

    constructor(public readonly defaultOpts: SuiteDefaults = {}) {
      this.baseUrl = suiteOpts.baseUrl || defaultOpts.baseUrl;
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

    public async __execute() {
      this.logger.start();
      this.events.emit('beforeAll');
      await Promise.all(
        this.befores.map(([methodName, before]) =>
          before(this, this.defaultScenarioOpts),
        ),
      );
      for (const step of this.steps) {
        let fatalError = false;
        await Promise.all(
          step.scenarios.map(async scenario => {
            try {
              this.events.emit('beforeEach', scenario);
              await scenario.__startUp();
              await scenario.__execute();
              try {
                await scenario.__next(scenario);
              } catch (ex) {
                scenario.logger.fail(`${ex}`);
              }
              await scenario.__tearDown();
              this.events.emit('afterEach', scenario);
              this.logger.log(scenario.status == 'pass' ? 'pass' : 'fail', {
                text: scenario.title,
              });
            } catch (ex) {
              scenario.logger.fail(ex);
              this.logger.fail(scenario.title);
              fatalError = true;
            }
          }),
        );
        if (fatalError) break;
      }
      await Promise.all(
        this.afters.map(([methodName, after]) =>
          after(this, this.defaultScenarioOpts),
        ),
      );
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

    public get<T = any>(key: string): T {
      return this.store.get(key) as T;
    }

    public push<T = any>(key: string, value: T): T[] {
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
