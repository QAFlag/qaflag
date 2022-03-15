import { LogCollector, LogEmmitter } from '../types/log-provider.interface';
import { MessageInterface } from '../types/message.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ScenarioConstructor, ScenarioOpts } from '../types/scenario.types';

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
  return class SuiteAbstract implements LogEmmitter, LogCollector {
    #messages: MessageInterface[] = [];

    public readonly title = initOpts.title;
    public readonly scenarios: ScenarioType[] = [];
    public readonly steps: SuiteStep[] = [];

    constructor() {
      // Add scenarios to this instance
      const scenarioMethods: { [methodName: string]: ScenarioOpts } =
        this[ScenarioDefinitions];
      if (scenarioMethods) {
        Object.values(scenarioMethods)
          .sort((a, b) => a.step - b.step)
          .forEach(scenario => {
            this.scenarios.push(new scenarioConstructor(scenario));
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
      this.log({ text: this.title });
      this.log({
        text: `There are ${this.scenarios.length} scenarios and ${this.steps.length} steps.`,
      });
      for (const step of this.steps) {
        this.log({ text: `==== STEP ${step.stepNumber} ====` });
        await Promise.all(
          step.scenarioKeys.map(async key => {
            const scenario = this.scenario(key);
            scenario.log({ text: `Execute ${String(key)} - ${scenario.uri}` });
            await scenario.execute();
            await scenario.next(scenario);
            scenario.getLog().forEach(message => {
              this.log(message);
            });
          }),
        );
      }
      console.log(...this.getLog().map(message => message.text + '\n'));
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

    public log(messages: MessageInterface | MessageInterface[]): void {
      if (!Array.isArray(messages)) {
        this.#messages.push(messages);
        return;
      }
      messages.forEach(message => {
        this.#messages.push(message);
      });
    }

    public getLog(): MessageInterface[] {
      return this.#messages;
    }
  };
}
