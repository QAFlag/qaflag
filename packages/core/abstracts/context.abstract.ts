import { MessageType } from '../models/message';
import { ContextInterface } from '../types/context.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ValueInterface } from '../types/value.interface';

export abstract class Context implements ContextInterface {
  constructor(public readonly scenario: ScenarioInterface) {}

  public debug(...messages: (string | number | boolean | ValueInterface)[]) {
    messages.forEach(message => {
      const text = (() => {
        if (
          typeof message == 'string' ||
          typeof message == 'number' ||
          typeof message == 'boolean'
        ) {
          return String(message);
        }
        return message.string.$;
      })();
      this.scenario.log('info', text);
    });
  }

  public log(type: MessageType, text: string) {
    return this.scenario.log(type, text);
  }
}
