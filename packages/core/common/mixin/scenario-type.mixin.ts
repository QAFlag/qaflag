import { MessageInterface } from '../types/message.interface';
import { ResponseInterface } from '../types/response.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ScenarioOpts, ScenarioUri } from '../types/scenario.types';

export type ScenarioTypeOpts = {
  name: string;
};

export function ScenarioType(initOpts: ScenarioTypeOpts) {
  abstract class ScenarioAbstract implements ScenarioInterface {
    #messages: MessageInterface[] = [];

    constructor(public readonly opts: ScenarioOpts) {
      this.key = opts.key;
      this.description = opts.description;
      this.uri = opts.uri;
      this.step = opts.step || 1;
      this.next = opts.next;
    }

    public abstract response: ResponseInterface | null;
    public abstract execute(): Promise<void>;

    public name: string = initOpts.name;
    public key: string | Symbol;
    public description: string;
    public uri: ScenarioUri;
    public step: number;
    public next: (...args: any[]) => Promise<void>;

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
  }
  return ScenarioAbstract;
}
