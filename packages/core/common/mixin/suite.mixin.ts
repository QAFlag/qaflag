import { KvStore } from '../models/kv-store';
import { Logger } from '../models/logger';
import { LogCollector, LogReceiver } from '../types/log-provider.interface';
import { MessageType } from '../types/message.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ScenarioConstructor, ScenarioOpts } from '../types/scenario.types';
import { SuiteInterface } from '../types/suite.interface';

export const ScenarioDefinitions = Symbol('ScenarioDefinitions');

type SuiteStep = {
  stepNumber: number;
  scenarioKeys: (string | Symbol)[];
};

export type SuiteOpts = {
  title: string;
};

export function Suite<ScenarioType extends ScenarioInterface>(
  scenarioConstructor: ScenarioConstructor<ScenarioType>,
  initOpts: SuiteOpts,
) {
  return class SuiteAbstract implements SuiteInterface {
    public readonly title = initOpts.title;
    public readonly scenarios: ScenarioType[] = [];
    public readonly steps: SuiteStep[] = [];
    public readonly store = new KvStore();
    public readonly logger = new Logger();

    constructor() {
      // Add scenarios to this instance
      const scenarioMethods: { [methodName: string]: ScenarioOpts } =
        this[ScenarioDefinitions];
      if (scenarioMethods) {
        Object.values(scenarioMethods)
          .sort((a, b) => a.step - b.step)
          .forEach(scenario => {
            this.scenarios.push(new scenarioConstructor(scenario, this));
          });
      }
      // Initialize suite
      this.init();
      // Execute
      setTimeout(async () => {
        await this.execute();
      }, 1);
    }

    public init() {
      this.scenarios.forEach(scenario => {
        this.addScenarioToStep(scenario);
      });
    }

    public async execute() {
      this.logger.log('suiteHeader', this.title);
      this.logger.log(
        'info',
        `There are ${this.scenarios.length} scenarios and ${this.steps.length} steps.`,
      );
      for (const step of this.steps) {
        this.logger.log('step', `==== STEP ${step.stepNumber} ====`);
        await Promise.all(
          step.scenarioKeys.map(async key => {
            const scenario = this.scenario(key);
            scenario.request.pathReplace(this.store.entries());
            scenario.log('info', `Execute ${String(key)} - ${scenario.uri}`);
            await scenario.execute();
            await scenario.next(scenario);
            scenario.logger.getMessages().forEach(message => {
              this.logger.add(message);
            });
          }),
        );
      }
      console.log(
        ...this.logger
          .getMessages()
          .map(message => `${message.type} - ${message.text}` + '\n'),
      );
    }

    public scenario(key: string | Symbol): ScenarioType | undefined {
      return this.scenarios.find(scenario => scenario.key === key);
    }

    private getStep(stepNumber: number): SuiteStep {
      // Look for existing step with this number
      const step = this.steps.find(step => step.stepNumber === stepNumber);
      if (step) return step;
      // Create new step
      const newStep: SuiteStep = {
        stepNumber,
        scenarioKeys: [],
      };
      this.steps.push(newStep);
      this.steps.sort((a, b) => a.stepNumber - b.stepNumber);
      return newStep;
    }

    private addScenarioToStep(scenario: ScenarioType) {
      const step = this.getStep(scenario.step);
      step.scenarioKeys.push(scenario.key);
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
